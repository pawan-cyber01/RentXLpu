import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.svg';
import AnnouncementMarquee from '../common/AnnouncementMarquee';

const NAV_TABS = [
  { path: '/buy', label: 'Buy' },
  { path: '/rent', label: 'Rent' },
  { path: '/need', label: 'Need' },
];

// Pages where Buy/Rent/Need sub-nav is displayed
const SHOW_SUBNAV_PATHS = ['/', '/buy', '/rent', '/need', '/explore'];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, userProfile } = useAuth();
  const location = useLocation();

  const currentPath = location.pathname;
  const showSubNav = SHOW_SUBNAV_PATHS.includes(currentPath);

  // Get user initial for avatar
  const displayName = userProfile?.name || user?.displayName || '';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
  const photoURL = user?.photoURL || userProfile?.profilePhoto || '';

  return (
    <>
      {/* Top Announcement Marquee Banner */}
      <AnnouncementMarquee />

      <header className="header">
        <div className="header-inner">
          {/* Left: Logo */}
          <Link to="/" className="header-logo" aria-label="RentX Home">
            <img src={logo} alt="RentX" />
            <span>Rent<span style={{ color: 'var(--primary-500)' }}>X</span></span>
          </Link>

          {/* Right: Theme Toggle + Chat (desktop) + Profile Avatar */}
          <div className="header-actions">
            <button
              className="btn-icon btn-ghost"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link
              to={isAuthenticated ? '/chat' : '/login'}
              className="btn-icon btn-ghost desktop-only"
              aria-label="Chat"
            >
              <MessageCircle size={18} />
            </Link>

            {/* Profile Avatar — top right */}
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="header-profile-avatar"
              aria-label="Profile"
            >
              {photoURL ? (
                <img src={photoURL} alt={displayName} className="header-avatar-img" referrerPolicy="no-referrer" />
              ) : (
                <span className="header-avatar-initial">{initial}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Sub-Nav Tabs (Buy | Rent | Need) — separate from header */}
      {showSubNav && (
        <div className="sub-header-nav">
          <nav className="nav-tabs">
            {NAV_TABS.map(tab => (
              <Link
                key={tab.path}
                to={isAuthenticated ? tab.path : '/login'}
                className={`nav-tab ${currentPath === tab.path ? 'active' : ''}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
