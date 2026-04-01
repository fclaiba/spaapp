import { Outlet } from "react-router";
import { Header } from "../components/ui/Header";
import { Footer } from "../components/ui/Footer";
import { ModalProvider } from "../components/modals/ModalContext";
import { ModalHost } from "../components/modals/ModalHost";

export function MarketingLayout() {
  return (
    <ModalProvider>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ModalHost />
    </ModalProvider>
  );
}
