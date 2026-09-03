import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, MessageCircle, MessageSquareHeart, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/list', icon: Plus, label: 'List', center: true },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/rate-rentx', icon: MessageSquareHeart, label: 'Feedback' },
];

export default function BottomNav() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    if (!isAuthenticated && path !== '/') {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <nav className="bottom-nav mobile-only" aria-label="Main navigation">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map(item => {
          if (item.center) {
            return (
              <div key={item.path} className="bottom-nav-center">
                <button
                  className="bottom-nav-center-btn"
                  onClick={() => navigate(isAuthenticated ? '/list' : '/login')}
                  aria-label="Create listing"
                >
                  <Plus size={24} strokeWidth={2.5} />
                </button>
                <span className="bottom-nav-center-label">{item.label}</span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `bottom-nav-item ${isActive ? 'active' : ''}`
              }
              onClick={(e) => handleNavClick(e, item.path)}
              aria-label={item.label}
            >
              <item.icon size={22} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
