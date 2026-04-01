import { createBrowserRouter } from "react-router";

import { RootLayout } from "./layouts/RootLayout";
import { MarketingLayout } from "./layouts/MarketingLayout";
import { BookingLayout } from "./layouts/BookingLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { RequireAuth } from "./components/auth/RequireAuth";

import { LandingPage } from "./pages/marketing/LandingPage";
import { BookingPage } from "./pages/booking/BookingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { CitasPage } from "./pages/admin/CitasPage";
import { ClientesPage } from "./pages/admin/ClientesPage";
import { ConfiguracionPage } from "./pages/admin/ConfiguracionPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: MarketingLayout,
        children: [
          { index: true, Component: LandingPage },
        ],
      },
      {
        path: "/agendar",
        Component: BookingLayout,
        children: [
          { index: true, Component: BookingPage },
        ],
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/dashboard",
        Component: RequireAuth,
        children: [
          {
            Component: AdminLayout,
            children: [
              { index: true, Component: DashboardPage },
              { path: "citas", Component: CitasPage },
              { path: "clientes", Component: ClientesPage },
              { path: "configuracion", Component: ConfiguracionPage },
            ],
          },
        ],
      },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
