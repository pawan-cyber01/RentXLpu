import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Heart, ClipboardList, Star, Settings, LogOut,
  ChevronRight, ShieldCheck, MessageCircle, HandCoins
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { maskPhone } from '../lib/utils';

export default function ProfilePage() {
  const { user, userProfile, logout, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { icon: Package, label: 'My Listings', path: '/my-listings', color: 'var(--primary-500)' },
    { icon: ClipboardList, label: 'My Needs', path: '/my-needs', color: '#f59e0b' },
    { icon: Heart, label: 'Favorites', path: '/favorites', color: '#ef4444' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', color: '#3b82f6' },
    { icon: Star, label: 'Platform Reviews', path: '/reviews', color: '#22c55e' },
    { icon: HandCoins, label: 'Rate RentX', path: '/rate-rentx', color: '#8b5cf6' },
  ];

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="page-content" style={{ paddingTop: 'var(--space-4)' }}>
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {userProfile?.profilePhoto ? (
            <img src={userProfile.profilePhoto} alt={userProfile.name || 'Profile'} />
          ) : (
            initials
          )}
        </div>

        <div>
          <h2 className="profile-name">{userProfile?.name || 'Set your name'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'center', marginTop: 'var(--space-1)' }}>
            <ShieldCheck size={14} color="var(--success)" />
            <span className="text-sm text-secondary">
              Verified Account
            </span>
          </div>
          <p className="text-xs text-tertiary" style={{ marginTop: 2 }}>
            {userProfile?.email || user?.email || userProfile?.phoneNumber || 'Verified Student'}
          </p>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">⭐ {userProfile?.rating || 0}</div>
            <div className="profile-stat-label">Rating</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">{userProfile?.totalDeals || 0}</div>
            <div className="profile-stat-label">Deals</div>
          </div>
        </div>
      </div>

      {/* Set Name prompt if not set */}
      {!userProfile?.name && (
        <div style={{
          margin: '0 var(--space-4) var(--space-4)',
          padding: 'var(--space-4)',
          background: 'var(--warning-bg)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        }}>
          <p className="text-sm font-medium" style={{ color: '#b45309', marginBottom: 'var(--space-2)' }}>
            Complete your profile
          </p>
          <Link to="/settings" className="btn btn-sm btn-primary">Set your name</Link>
        </div>
      )}

      {/* Menu Items */}
      <div className="profile-menu">
        {menuItems.map(item => (
          <Link key={item.path} to={item.path} className="profile-menu-item">
            <div className="profile-menu-item-icon" style={{ background: `${item.color}15`, color: item.color }}>
              <item.icon size={20} />
            </div>
            <span className="profile-menu-item-text">{item.label}</span>
            <ChevronRight size={18} className="profile-menu-item-arrow" />
          </Link>
        ))}

        <div className="divider" />

        <button onClick={handleLogout} className="profile-menu-item" style={{ border: 'none', width: '100%', background: 'var(--error-bg)', cursor: 'pointer' }}>
          <div className="profile-menu-item-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
            <LogOut size={20} />
          </div>
          <span className="profile-menu-item-text" style={{ color: 'var(--error)' }}>Log Out</span>
          <ChevronRight size={18} className="profile-menu-item-arrow" />
        </button>
      </div>
    </div>
  );
}
