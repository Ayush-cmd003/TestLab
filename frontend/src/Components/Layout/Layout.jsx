import { Outlet } from "react-router-dom";
import AppHeader from "../Navbar/Navbar";

function Layout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <AppHeader />

            <main className="max-w-7xl mx-auto px-6 py-6">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;