import { Outlet } from "@tanstack/react-router";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}