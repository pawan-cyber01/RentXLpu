import { MapPin, Clock, Tag } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export default function NeedCard({ need }) {
  return (
    <div className="card glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div className="flex-between">
        <span className="badge badge-primary">{need.category}</span>
        <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
          {need.status || 'Active'}
        </span>
      </div>

      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>{need.productName}</h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
        {need.budget > 0 && (
          <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--primary-600)' }}>
            Budget: {formatPrice(need.budget)}
          </span>
        )}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <MapPin size={12} /> {need.location}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <Clock size={12} /> {need.neededBy || 'Flexible'}
        </span>
      </div>
    </div>
  );
}
