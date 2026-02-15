import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
    const [menuOpen, setMenuOpen] = useState(false);

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
            </aside>

            {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />}

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
