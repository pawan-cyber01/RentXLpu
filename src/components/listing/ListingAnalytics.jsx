import { Eye, Heart, MessageCircle, Calendar } from 'lucide-react';
import { timeAgo } from '../../lib/utils';

export default function ListingAnalytics({ listing, onClose }) {
  if (!listing) return null;

  const stats = [
    { icon: Eye, label: 'Views', value: listing.views || 0, color: '#3b82f6' },
    { icon: Heart, label: 'Saves', value: listing.favoritesCount || 0, color: '#ef4444' },
    { icon: MessageCircle, label: 'Chats', value: listing.chatsCount || 0, color: '#8b5cf6' },
  ];

  const postedDate = listing.createdAt?.toDate ? timeAgo(listing.createdAt.toDate()) : 'Recently';

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Listing Analytics</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p className="text-sm font-semibold">{listing.productName}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            {stats.map(s => (
              <div
                key={s.label}
                style={{
                  padding: 'var(--space-3)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                }}
              >
                <s.icon size={20} color={s.color} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{s.value}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            <Calendar size={14} /> Posted {postedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
