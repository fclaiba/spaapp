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
        // If demo credentials are used and the account does not exist yet,
        // create it automatically so the user can access immediately.
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
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/logo.svg" alt="Medallo Spa" className="mx-auto mb-6 h-20 w-auto" />
          <p className="ux-overline mb-2">Panel operativo</p>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {mode === "signIn" ? "Iniciar sesión" : "Crear cuenta admin"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {mode === "signIn"
              ? "Accede al panel de administración de Medallo Spa"
              : "Registra el primer usuario administrador"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 flex rounded-full border border-[var(--color-border-medium)] p-1">
          <button
            type="button"
            onClick={() => { setMode("signIn"); setError(null); }}
            className={`flex-1 rounded-full py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              mode === "signIn"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode("signUp"); setError(null); }}
            className={`flex-1 rounded-full py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all ${
              mode === "signUp"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
            }`}
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
              className="ux-input rounded-2xl"
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
                className="ux-input rounded-2xl pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
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

        <div className="mt-4 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            Acceso desarrollo
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-primary)]">
            Usuario: <span className="font-semibold">{DEV_EMAIL}</span>
          </p>
          <p className="text-sm text-[var(--color-text-primary)]">
            Contraseña: <span className="font-semibold">{DEV_PASSWORD}</span>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-[var(--color-text-tertiary)]">
          Solo personal autorizado de Medallo Spa
        </p>
      </div>
    </div>
  );
}
