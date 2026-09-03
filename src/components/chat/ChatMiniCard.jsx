import { Link } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import { formatPrice, formatRentPrice } from '../../lib/utils';

export default function ChatMiniCard({ listingId, listingName, listingPrice, listingRentPrice, listingLocation }) {
  if (!listingName) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--bg-tertiary)',
      borderBottom: '1px solid var(--border-primary)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>{listingName}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span>{listingPrice ? formatPrice(listingPrice) : ''}</span>
          {listingRentPrice > 0 && (
            <span>{listingPrice ? '·' : ''} {formatRentPrice(listingRentPrice)}</span>
          )}
          {listingLocation && (
            <>
              <span>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <MapPin size={10} /> {listingLocation}
              </span>
            </>
          )}
        </div>
      </div>

      <Link
        to={`/product/${listingId}`}
        className="btn btn-ghost btn-sm"
        style={{ color: 'var(--primary-500)' }}
      >
        View Item <ExternalLink size={14} />
      </Link>
    </div>
  );
}
