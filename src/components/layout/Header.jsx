import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, MessageCircle, Download, CheckCircle2, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
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
  const { isInstalled, promptInstall } = usePwaInstall();
  const location = useLocation();
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const currentPath = location.pathname;
  const showSubNav = SHOW_SUBNAV_PATHS.includes(currentPath);

  // Get user initial for avatar
  const displayName = userProfile?.name || user?.displayName || '';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
  const photoURL = user?.photoURL || userProfile?.profilePhoto || '';

  const handleInstallClick = async () => {
    const success = await promptInstall();
    if (!success) {
      setShowInstructionsModal(true);
    }
  };

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

          {/* Right: Theme Toggle + PWA Install + Chat (desktop) + Profile Avatar */}
          <div className="header-actions">
            {/* Theme Toggle */}
            <button
              className="btn-icon btn-ghost"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* PWA Install Option Right Next to Toggle */}
            {!isInstalled && (
              <button
                className="btn-icon btn-ghost"
                onClick={handleInstallClick}
                aria-label="Install RentX App"
                title="Install RentX App on your phone/PC"
                style={{ color: 'var(--primary-500)', position: 'relative' }}
              >
                <Download size={18} />
              </button>
            )}

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

      {/* Instructions Modal if native prompt is blocked */}
      {showInstructionsModal && (
        <div className="overlay" style={{ zIndex: 1000 }}>
          <div className="modal glass-card card-body" style={{ width: '90%', maxWidth: 420, position: 'relative' }}>
            <button
              className="btn-icon btn-ghost"
              onClick={() => setShowInstructionsModal(false)}
              style={{ position: 'absolute', top: 12, right: 12 }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-3)' }}>
              Install RentX App
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="var(--primary-500)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Chrome / Android / Edge:</strong><br />
                  Click your browser menu <strong>(⋮)</strong> and select <strong>"Install RentX"</strong> or <strong>"Add to Home screen"</strong>.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="var(--primary-500)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>iOS Safari:</strong><br />
                  Tap the Share icon <strong>(⎋)</strong> and choose <strong>"Add to Home Screen"</strong>.
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => setShowInstructionsModal(false)}
              style={{ marginTop: 'var(--space-4)', borderRadius: 'var(--radius-xl)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
