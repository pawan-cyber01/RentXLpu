import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, HelpCircle, ShieldAlert,
  Megaphone, FolderTree, MapPin, Star, BarChart3, Settings, FileText, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.svg';

const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/listings', label: 'Listings', icon: Package },
  { path: '/admin/needs', label: 'Needs', icon: HelpCircle },
  { path: '/admin/reports', label: 'Reports', icon: ShieldAlert },
  { path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/admin/categories', label: 'Categories', icon: FolderTree },
  { path: '/admin/locations', label: 'Locations', icon: MapPin },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/activity', label: 'Admin Activity', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Sidebar Desktop */}
      <aside className="desktop-only" style={{
        width: 260,
        background: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-primary)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
      }}>
        <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-primary)' }}>
          <Link to="/admin" className="header-logo">
            <img src={logo} alt="RentX Admin" />
            <span>Rent<span style={{ color: 'var(--primary-500)' }}>X</span> Admin</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: 'var(--space-3)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ADMIN_NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `btn btn-ghost ${isActive ? 'btn-primary' : ''}`}
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.65rem 1rem',
                fontSize: 'var(--text-sm)',
              }}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--border-primary)' }}>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-full"
            style={{ color: 'var(--error)', justifyContent: 'flex-start' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Admin Header */}
      <div className="mobile-only" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
        height: 56, background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px'
      }}>
        <Link to="/admin" className="header-logo" style={{ fontSize: 'var(--text-lg)' }}>
          <span>RentX Admin</span>
        </Link>
        <button className="btn-icon btn-ghost" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle admin menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="mobile-only" style={{
          position: 'fixed', inset: 0, top: 56, zIndex: 290,
          background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column',
          padding: 'var(--space-4)', overflowY: 'auto', borderTop: '1px solid var(--border-primary)'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            {ADMIN_NAV.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `btn btn-ghost ${isActive ? 'btn-primary' : ''}`}
                style={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-full"
            style={{ color: 'var(--error)', justifyContent: 'flex-start', marginTop: 'var(--space-4)' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="admin-main-container">
        {children}
      </main>
    </div>
  );
}
