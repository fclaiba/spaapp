import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

type Mode = "signIn" | "signUp";

const DEV_EMAIL = "dev@medallospa.com";
const DEV_PASSWORD = "Medallo1234";
const DEV_BYPASS_KEY = "medallo_dev_mode";

export function LoginPage() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signIn("password", { email, password, flow: mode });
      void navigate("/dashboard");
    } catch (err) {
      if (mode === "signIn") {
        const isDemoCredentials = email.trim().toLowerCase() === DEV_EMAIL && password === DEV_PASSWORD;
        if (isDemoCredentials) {
          try {
            await signIn("password", { email: DEV_EMAIL, password: DEV_PASSWORD, flow: "signUp" });
            void navigate("/dashboard");
            return;
          } catch {
            setError("No se pudo crear el usuario de desarrollo automáticamente.");
            return;
          }
        }
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo crear la cuenta. Intenta con otra contraseña (mín. 8 caracteres).",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <div className="grain-overlay" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <p
            className="text-2xl tracking-[0.25em] text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MEDALLO SPA
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
          <p className="ux-overline mt-4">Panel operativo</p>
          <h1
            className="mt-2 text-2xl text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {mode === "signIn" ? "Iniciar sesión" : "Crear cuenta admin"}
          </h1>
        </div>

        <div className="mb-6 flex rounded-full border border-[var(--color-border-medium)] bg-[var(--color-surface)] p-1">
          <button
            type="button"
            onClick={() => { setMode("signIn"); setError(null); }}
            className={`flex-1 rounded-full py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              mode === "signIn"
                ? "text-[var(--color-primary-foreground)]"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            }`}
            style={mode === "signIn" ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" } : undefined}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode("signUp"); setError(null); }}
            className={`flex-1 rounded-full py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              mode === "signUp"
                ? "text-[var(--color-primary-foreground)]"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            }`}
            style={mode === "signUp" ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" } : undefined}
          >
            Registrar
          </button>
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@medallospa.com"
              required
              className="ux-input"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              Contraseña {mode === "signUp" && <span className="normal-case tracking-normal">(mín. 8 caracteres)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="ux-input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="ux-btn-primary w-full"
          >
            {mode === "signIn" ? <LogIn size={16} /> : <UserPlus size={16} />}
            {isLoading
              ? "Procesando..."
              : mode === "signIn"
              ? "Entrar al panel"
              : "Crear cuenta y entrar"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signIn");
              setEmail(DEV_EMAIL);
              setPassword(DEV_PASSWORD);
              setError(null);
            }}
            className="ux-btn-secondary w-full"
          >
            Usar usuario de desarrollo
          </button>

          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(DEV_BYPASS_KEY, "1");
              void navigate("/dashboard");
            }}
            className="ux-btn-secondary w-full"
          >
            Entrar en modo desarrollo
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
            Acceso desarrollo
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Usuario: <span className="font-semibold text-[var(--color-text-primary)]">{DEV_EMAIL}</span>
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Contraseña: <span className="font-semibold text-[var(--color-text-primary)]">{DEV_PASSWORD}</span>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--color-text-tertiary)]">
          Solo personal autorizado de Medallo Spa
        </p>
      </div>
    </div>
  );
}
