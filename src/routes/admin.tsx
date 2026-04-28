import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Letícia de Andrade" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type SiteImage = { key: string; url: string };
type Projeto = { id: string; nome: string; tipo: string; foto_url: string | null; ordem: number };

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  const [images, setImages] = useState<Record<string, string>>({});
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/login" });
  }, [user, isAdmin, loading, navigate]);

  const refresh = async () => {
    const [{ data: imgs }, { data: projs }] = await Promise.all([
      supabase.from("site_images").select("key,url"),
      supabase.from("projetos").select("*").order("ordem"),
    ]);
    const map: Record<string, string> = {};
    (imgs ?? []).forEach((i: SiteImage) => (map[i.key] = i.url));
    setImages(map);
    setProjetos(projs ?? []);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin]);

  const uploadAndGetUrl = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("site-fotos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("site-fotos").getPublicUrl(path);
    return data.publicUrl;
  };

  const setSiteImage = async (key: string, file: File) => {
    setBusy(key);
    setMsg(null);
    try {
      const url = await uploadAndGetUrl(file, key);
      const { error } = await supabase
        .from("site_images")
        .upsert({ key, url }, { onConflict: "key" });
      if (error) throw error;
      await refresh();
      setMsg("Imagem atualizada!");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const setProjetoFoto = async (id: string, file: File) => {
    setBusy(id);
    setMsg(null);
    try {
      const url = await uploadAndGetUrl(file, `projetos/${id}`);
      const { error } = await supabase.from("projetos").update({ foto_url: url }).eq("id", id);
      if (error) throw error;
      await refresh();
      setMsg("Foto do projeto atualizada!");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const updateProjetoCampo = async (id: string, campo: "nome" | "tipo" | "ordem", valor: string | number) => {
    await supabase.from("projetos").update({ [campo]: valor }).eq("id", id);
    refresh();
  };

  const addProjeto = async () => {
    const ordem = (projetos[projetos.length - 1]?.ordem ?? 0) + 1;
    await supabase.from("projetos").insert({ nome: "Novo projeto", tipo: "Interiores", ordem });
    refresh();
  };

  const delProjeto = async (id: string) => {
    if (!confirm("Excluir este projeto?")) return;
    await supabase.from("projetos").delete().eq("id", id);
    refresh();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading || !isAdmin) {
    return <div style={{ ...s.wrap, alignItems: "center", justifyContent: "center" }}>Carregando...</div>;
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <div>
          <h1 style={s.title}>Painel — Letícia de Andrade</h1>
          <p style={s.sub}>Gerencie as fotos e projetos do site</p>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/" style={s.linkBtn}>Ver site</Link>
          <button onClick={logout} style={s.linkBtn}>Sair</button>
        </div>
      </header>

      {msg && <div style={s.toast}>{msg}</div>}

      <section style={s.section}>
        <h2 style={s.sectionTitle}>Imagens principais</h2>
        <div style={s.grid2}>
          <ImageSlot
            label="Foto do Hero (topo do site)"
            currentUrl={images["hero"]}
            busy={busy === "hero"}
            onSelect={(f) => setSiteImage("hero", f)}
          />
          <ImageSlot
            label="Foto da seção Sobre"
            currentUrl={images["sobre"]}
            busy={busy === "sobre"}
            onSelect={(f) => setSiteImage("sobre", f)}
          />
        </div>
      </section>

      <section style={s.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={s.sectionTitle}>Projetos</h2>
          <button onClick={addProjeto} style={s.primaryBtn}>+ Adicionar projeto</button>
        </div>
        <div style={s.gridProj}>
          {projetos.map((p) => (
            <div key={p.id} style={s.projCard}>
              <ImageSlot
                compact
                currentUrl={p.foto_url ?? undefined}
                busy={busy === p.id}
                onSelect={(f) => setProjetoFoto(p.id, f)}
              />
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  defaultValue={p.nome}
                  onBlur={(e) => e.target.value !== p.nome && updateProjetoCampo(p.id, "nome", e.target.value)}
                  style={s.inlineInput}
                  placeholder="Nome do projeto"
                />
                <input
                  defaultValue={p.tipo}
                  onBlur={(e) => e.target.value !== p.tipo && updateProjetoCampo(p.id, "tipo", e.target.value)}
                  style={s.inlineInputSmall}
                  placeholder="Tipo (ex: Interiores — Reforma)"
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <label style={s.smallLabel}>
                    Ordem:
                    <input
                      type="number"
                      defaultValue={p.ordem}
                      onBlur={(e) => updateProjetoCampo(p.id, "ordem", Number(e.target.value))}
                      style={{ ...s.inlineInputSmall, width: 56, marginLeft: 8 }}
                    />
                  </label>
                  <button onClick={() => delProjeto(p.id)} style={s.dangerBtn}>Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ImageSlot({
  label,
  currentUrl,
  busy,
  onSelect,
  compact,
}: {
  label?: string;
  currentUrl?: string;
  busy?: boolean;
  onSelect: (f: File) => void;
  compact?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      {label && <p style={s.smallLabel}>{label}</p>}
      <div
        onClick={() => ref.current?.click()}
        style={{
          ...s.dropZone,
          height: compact ? 200 : 280,
          backgroundImage: currentUrl ? `url(${currentUrl})` : undefined,
          opacity: busy ? 0.5 : 1,
        }}
      >
        {!currentUrl && <span>{busy ? "Enviando..." : "Clique para enviar foto"}</span>}
        {currentUrl && (
          <span style={s.replaceHint}>{busy ? "Enviando..." : "Clique para substituir"}</span>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f5f3ef",
    fontFamily: "'DM Sans', sans-serif",
    padding: "32px 48px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 24,
    borderBottom: "1px solid #1f1f1f",
    marginBottom: 32,
    flexWrap: "wrap",
    gap: 16,
  },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300 },
  sub: { color: "#888", fontSize: 13, marginTop: 4 },
  linkBtn: { background: "transparent", border: "1px solid #2a2a2a", color: "#f5f3ef", padding: "10px 18px", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none" },
  primaryBtn: { background: "#f5f3ef", color: "#0a0a0a", border: "none", padding: "10px 20px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  dangerBtn: { background: "transparent", border: "1px solid #5a2020", color: "#d97070", padding: "6px 12px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" },
  toast: { background: "#1a2a1a", border: "1px solid #2a4a2a", color: "#a8d8a8", padding: "12px 20px", fontSize: 13, marginBottom: 24 },
  section: { marginBottom: 48 },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, marginBottom: 24 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  gridProj: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 },
  projCard: { background: "#111", border: "1px solid #1f1f1f" },
  dropZone: {
    border: "1px dashed #333",
    background: "#0d0d0d",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    fontSize: 12,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "border-color 0.2s",
    position: "relative",
  },
  replaceHint: { background: "rgba(0,0,0,0.6)", padding: "6px 12px", fontSize: 10, color: "#fff" },
  smallLabel: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginBottom: 8, display: "block" },
  inlineInput: { background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f3ef", padding: "8px 10px", fontSize: 13, fontFamily: "inherit" },
  inlineInputSmall: { background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f3ef", padding: "6px 10px", fontSize: 12, fontFamily: "inherit" },
};
