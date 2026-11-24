import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

export const Route = createRootRoute({
    component: () => (
        <><div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 bg-[#f6f7f9] px-[80px]">
                <Outlet />
            </main>
            <Footer />
        </div>
        </>
    ),
    notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});