import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acesso Admin — Letícia de Andrade" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [allowSignup, setAllowSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Show signup option only if no admin exists yet (first-time setup)
  useEffect(() => {
    supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin")
      .then(({ count }) => setAllowSignup((count ?? 0) === 0));
  }, []);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin" });
  }, [user, isAdmin, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (data.user) {
          // Promote first user to admin
          const { error: rerr } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role: "admin" });
          if (rerr) throw rerr;
          setMsg("Conta criada! Você já é o administrador. Entrando...");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMsg((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <Link to="/" style={styles.back}>← voltar ao site</Link>
        <h1 style={styles.title}>
          {mode === "signup" ? "Criar conta admin" : "Acesso Admin"}
        </h1>
        <p style={styles.sub}>
          {mode === "signup"
            ? "Primeiro acesso — crie a conta de administradora do site."
            : "Entre para gerenciar as fotos do site."}
        </p>

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <label style={styles.label}>Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" disabled={busy} style={styles.btn}>
            {busy ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"}
          </button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}

        {allowSignup && (
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={styles.toggle}
          >
            {mode === "login"
              ? "Primeiro acesso? Criar conta admin"
              : "Já tenho conta — fazer login"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f5f3ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#111",
    padding: 48,
    border: "1px solid #1f1f1f",
  },
  back: { color: "#aaa", textDecoration: "none", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginTop: 32, marginBottom: 8 },
  sub: { color: "#aaa", fontSize: 13, marginBottom: 32 },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginTop: 12 },
  input: { background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f3ef", padding: "12px 14px", fontSize: 14, fontFamily: "inherit" },
  btn: { marginTop: 24, background: "#f5f3ef", color: "#0a0a0a", padding: "14px 24px", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer", fontWeight: 500 },
  msg: { marginTop: 16, fontSize: 13, color: "#e0c97a" },
  toggle: { marginTop: 24, background: "transparent", border: "none", color: "#aaa", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", textDecoration: "underline" },
};
