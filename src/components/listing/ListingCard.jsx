import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Eye, Pause, Play, CheckCircle, Trash2, BarChart2 } from 'lucide-react';
import { formatPrice, formatRentPrice, timeAgo } from '../../lib/utils';
import ConfirmModal from '../ui/ConfirmModal';

export default function ListingCard({ listing, onStatusChange, onDelete, onShowAnalytics }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const statusColors = {
    active: 'var(--success)',
    paused: 'var(--warning)',
    reserved: 'var(--info)',
    rented: 'var(--primary-500)',
    sold: 'var(--gray-500)',
  };

  return (
    <div className="glass-card card-body" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--text-xl)',
        flexShrink: 0,
      }}>
        📦
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: statusColors[listing.status] || 'var(--gray-500)'
          }} />
          <span className="text-xs font-semibold" style={{ textTransform: 'capitalize', color: statusColors[listing.status] }}>
            {listing.status}
          </span>
        </div>

        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{listing.productName}</h4>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {listing.sellPrice ? formatPrice(listing.sellPrice) : ''}
          {listing.rentPrice ? ` ${formatRentPrice(listing.rentPrice)}` : ''}
        </div>
      </div>

      {/* Analytics & 3-dot Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
        <button
          className="btn-icon btn-ghost btn-sm"
          onClick={() => onShowAnalytics(listing)}
          title="View Analytics"
        >
          <BarChart2 size={16} />
        </button>

        <button
          className="btn-icon btn-ghost btn-sm"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Manage options"
        >
          <MoreVertical size={16} />
        </button>

        {showMenu && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-1)',
            zIndex: 20,
            width: 150,
          }}>
            <button
              onClick={() => { setShowMenu(false); navigate(`/edit-listing/${listing.id}`); }}
              style={menuItemStyle}
            >
              <Edit size={14} /> Edit
            </button>

            {listing.status === 'active' ? (
              <button onClick={() => { setShowMenu(false); onStatusChange(listing.id, 'paused'); }} style={menuItemStyle}>
                <Pause size={14} /> Pause
              </button>
            ) : listing.status === 'paused' ? (
              <button onClick={() => { setShowMenu(false); onStatusChange(listing.id, 'active'); }} style={menuItemStyle}>
                <Play size={14} /> Resume
              </button>
            ) : null}

            <button onClick={() => { setShowMenu(false); onStatusChange(listing.id, 'sold'); }} style={menuItemStyle}>
              <CheckCircle size={14} /> Mark Sold
            </button>

            <button onClick={() => { setShowMenu(false); onStatusChange(listing.id, 'rented'); }} style={menuItemStyle}>
              <CheckCircle size={14} /> Mark Rented
            </button>

            <button
              onClick={() => { setShowMenu(false); setShowConfirmDelete(true); }}
              style={{ ...menuItemStyle, color: 'var(--error)' }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => onDelete(listing.id)}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? Important audit info will be preserved."
        confirmText="Delete"
        danger
      />
    </div>
  );
}

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  background: 'none',
  fontSize: 'var(--text-xs)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  textAlign: 'left',
};
