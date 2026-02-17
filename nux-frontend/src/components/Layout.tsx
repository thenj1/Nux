import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Layers,
    Package,
    FlaskConical,
    Cpu,
    LogOut,
    Bell,
    Menu,
    X,
} from 'lucide-react';

const navItems = [
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Raw Materials', path: '/raw-materials', icon: FlaskConical },
    { label: 'Production', path: '/production', icon: Cpu },
];

function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Layers size={18} className="text-white" />
                    </div>
                    <div>
                        <span className="text-white tracking-widest font-bold text-lg" style={{ letterSpacing: '0.2em' }}>NUX</span>
                        <p className="text-blue-400/70 text-xs" style={{ letterSpacing: '0.12em', lineHeight: 1 }}>MANUFACTURING OS</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-slate-500 text-xs px-3 mb-2 tracking-wider uppercase font-semibold">
                    Main Menu
                </p>
                {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
                                <span className={isActive ? 'font-semibold' : 'font-normal'}>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User & Logout */}
            <div className="px-3 pb-4 space-y-2 border-t border-slate-700/50 pt-4">
                {user && (
                    <div className="px-3 py-3 rounded-xl bg-slate-700/30">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-400 text-sm font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm truncate font-medium">{user.name}</p>
                                <p className="text-slate-500 text-xs truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                >
                    <LogOut size={17} />
                    <span>Log out</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="relative flex flex-col w-64 bg-[#0f172a] z-10 h-full">
                        <div className="absolute top-4 right-4 lg:hidden">
                            <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-8 lg:mt-0 h-full">
                            <SidebarContent />
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <button
                        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Breadcrumb or Title placeholder - Hidden on mobile if needed */}
                    <div className="hidden lg:block text-slate-500 text-sm">

                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                        </button>
                        {user && (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
