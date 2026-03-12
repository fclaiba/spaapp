import { Outlet, Link } from "react-router";
import { Header } from "../components/ui/Header";
import { Footer } from "../components/ui/Footer";

export function MarketingLayout() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
