import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projetos/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Projeto ${params.slug} — Letícia de Andrade` },
      { name: "description", content: "Detalhes e galeria do projeto." },
    ],
  }),
  notFoundComponent: () => (
    <div style={wrap.page}>
      <h1 style={wrap.title}>Projeto não encontrado</h1>
      <Link to="/" style={wrap.back}>← Voltar ao site</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div style={wrap.page}>
        <h1 style={wrap.title}>Erro ao carregar projeto</h1>
        <p style={{ color: "#888" }}>{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} style={wrap.back}>Tentar novamente</button>
      </div>
    );
  },
  component: ProjetoPage,
});

type Projeto = {
  id: string; nome: string; tipo: string; foto_url: string | null;
  slug: string; descricao: string | null;
  local: string | null; area: string | null; ano: string | null;
};
type Img = { id: string; url: string; ordem: number };

function ProjetoPage() {
  const { slug } = Route.useParams();
  const [projeto, setProjeto] = useState<Projeto | null | undefined>(undefined);
  const [imagens, setImagens] = useState<Img[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from("projetos")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!p) { setProjeto(null); return; }
      setProjeto(p as Projeto);
      const { data: imgs } = await supabase
        .from("projeto_imagens")
        .select("id,url,ordem")
        .eq("projeto_id", p.id)
        .order("ordem");
      setImagens((imgs ?? []) as Img[]);
    })();
  }, [slug]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : Math.min(i + 1, imagens.length - 1)));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : Math.max(i - 1, 0)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, imagens.length]);

  if (projeto === undefined) return <div style={wrap.page}>Carregando...</div>;
  if (projeto === null) throw notFound();

  const todas = projeto.foto_url
    ? [{ id: "cover", url: projeto.foto_url, ordem: 0 }, ...imagens]
    : imagens;

  return (
    <div style={wrap.page}>
      <header style={wrap.header}>
        <Link to="/" style={wrap.back}>← Voltar</Link>
      </header>

      <section style={wrap.intro}>
        <span style={wrap.tipo}>{projeto.tipo}</span>
        <h1 style={wrap.title}>{projeto.nome}</h1>
        {projeto.descricao && <p style={wrap.desc}>{projeto.descricao}</p>}
        {(projeto.local || projeto.area || projeto.ano) && (
          <dl style={wrap.ficha}>
            {projeto.local && (<><dt style={wrap.dt}>Local</dt><dd style={wrap.dd}>{projeto.local}</dd></>)}
            {projeto.area && (<><dt style={wrap.dt}>Área</dt><dd style={wrap.dd}>{projeto.area}</dd></>)}
            {projeto.ano && (<><dt style={wrap.dt}>Ano</dt><dd style={wrap.dd}>{projeto.ano}</dd></>)}
          </dl>
        )}
      </section>

      {todas.length > 0 ? (
        <section style={wrap.grid}>
          {todas.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightbox(i)}
              style={{ ...wrap.thumb, backgroundImage: `url(${img.url})` }}
              aria-label={`Abrir foto ${i + 1}`}
            />
          ))}
        </section>
      ) : (
        <p style={{ color: "#888", textAlign: "center", padding: "60px 0" }}>Em breve, fotos deste projeto.</p>
      )}

      {lightbox !== null && todas[lightbox] && (
        <div style={wrap.lightbox} onClick={() => setLightbox(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(lightbox - 1, 0)); }} style={{ ...wrap.lbBtn, left: 16 }} disabled={lightbox === 0}>‹</button>
          <img src={todas[lightbox].url} alt="" style={wrap.lbImg} onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(lightbox + 1, todas.length - 1)); }} style={{ ...wrap.lbBtn, right: 16 }} disabled={lightbox === todas.length - 1}>›</button>
          <button onClick={() => setLightbox(null)} style={wrap.lbClose} aria-label="Fechar">×</button>
          <span style={wrap.lbCount}>{lightbox + 1} / {todas.length}</span>
        </div>
      )}
    </div>
  );
}

const wrap: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f5f3ef", color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", padding: "32px 48px" },
  header: { marginBottom: 48 },
  back: { color: "#1a1a1a", textDecoration: "none", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid #1a1a1a", padding: "10px 18px", display: "inline-block", background: "transparent", cursor: "pointer" },
  intro: { maxWidth: 760, margin: "0 auto 64px" },
  tipo: { fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "#666", display: "block", marginBottom: 16 },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, lineHeight: 1, marginBottom: 24 },
  desc: { fontSize: 16, lineHeight: 1.7, color: "#444", marginBottom: 32 },
  ficha: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 24px", borderTop: "1px solid #ddd", paddingTop: 24 },
  dt: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", margin: 0 },
  dd: { margin: 0, fontSize: 14, color: "#1a1a1a" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, maxWidth: 1400, margin: "0 auto", alignItems: "start" },
  thumb: { aspectRatio: "3/4", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "#ebe6dc", border: "1px solid #ddd8cf", cursor: "zoom-in", padding: 0, transition: "opacity 0.2s" },
  lightbox: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  lbImg: { maxWidth: "92vw", maxHeight: "90vh", objectFit: "contain" },
  lbBtn: { position: "absolute", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", width: 48, height: 48, fontSize: 32, cursor: "pointer" },
  lbClose: { position: "absolute", top: 16, right: 16, background: "transparent", color: "#fff", border: "none", fontSize: 32, cursor: "pointer", width: 48, height: 48 },
  lbCount: { position: "absolute", bottom: 24, color: "#fff", fontSize: 12, letterSpacing: "0.2em" },
};
