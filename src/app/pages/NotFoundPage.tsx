import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4">
      <div className="grain-overlay" />
      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        <p
          className="text-7xl font-light leading-none tracking-tighter text-[var(--color-primary)] sm:text-8xl lg:text-9xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </p>
        <h1 className="ux-h2 mt-6">Página no encontrada</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Link to="/" className="ux-btn-primary text-center">
            Volver al inicio
          </Link>
          <Link to="/agendar" className="ux-btn-secondary text-center">
            Reservar cita
          </Link>
        </div>
      </div>
    </div>
  );
}
