import { lazy, Suspense } from "react";
const Application =
  import.meta.env.VITE_DEMO_MODE === "true"
    ? lazy(() => import("./AppShell.jsx"))
    : lazy(() => import("./connected/ConnectedApp.jsx"));
export default function App() {
  return (
    <Suspense
      fallback={
        <main className="load-error">
          <p role="status">Cargando CampusTrade…</p>
        </main>
      }
    >
      <Application />
    </Suspense>
  );
}
