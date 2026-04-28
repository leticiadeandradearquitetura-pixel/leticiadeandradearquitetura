import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — Letícia de Andrade" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The recovery link sets a session via URL hash. Wait for it.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg("Senha atualizada! Redirecionando...");
      setTimeout(() => navigate({ to: "/admin" }), 1500);
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
        <h1 style={styles.title}>Nova senha</h1>
        <p style={styles.sub}>
          {ready
            ? "Digite sua nova senha abaixo."
            : "Validando link de recuperação..."}
        </p>

        {ready && (
          <form onSubmit={submit} style={styles.form}>
            <label style={styles.label}>Nova senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" disabled={busy} style={styles.btn}>
              {busy ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", background: "#0a0a0a", color: "#f5f3ef", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" },
  card: { width: "100%", maxWidth: 420, background: "#111", padding: 48, border: "1px solid #1f1f1f" },
  back: { color: "#aaa", textDecoration: "none", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, marginTop: 32, marginBottom: 8 },
  sub: { color: "#aaa", fontSize: 13, marginBottom: 32 },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888", marginTop: 12 },
  input: { background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f5f3ef", padding: "12px 14px", fontSize: 14, fontFamily: "inherit" },
  btn: { marginTop: 24, background: "#f5f3ef", color: "#0a0a0a", padding: "14px 24px", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", border: "none", cursor: "pointer", fontWeight: 500 },
  msg: { marginTop: 16, fontSize: 13, color: "#e0c97a" },
};