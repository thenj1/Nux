import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <div className="layout">
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                Menu
            </button>

            <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h2>NUX</h2>
                    <p className="sidebar-subtitle">Inventory Control</p>
                </div>

                {user && (
                    <div className="sidebar-user">
                        <span className="sidebar-user-name">{user.name}</span>
                        <span className="sidebar-user-email">{user.email}</span>
                    </div>
                )}

                <nav className="sidebar-nav">
                    <NavLink
                        to="/products"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={() => setMenuOpen(false)}
                    >
                        Products
                    </NavLink>
                    <NavLink
                        to="/raw-materials"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={() => setMenuOpen(false)}
                    >
                        Raw Materials
                    </NavLink>
                    <NavLink
                        to="/production"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={() => setMenuOpen(false)}
                    >
                        Production
                    </NavLink>
                </nav>

                <button className="sidebar-logout" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
