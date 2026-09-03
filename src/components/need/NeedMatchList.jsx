import { MessageCircle } from 'lucide-react';
import ProductCard from '../marketplace/ProductCard';
import EmptyState from '../ui/EmptyState';

export default function NeedMatchList({ matches = [], loading }) {
  if (loading) {
    return <p className="text-sm text-secondary text-center">Searching nearby listings for matches...</p>;
  }

  if (matches.length === 0) {
    return (
      <div style={{
        padding: 'var(--space-6)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
      }}>
        <p className="text-sm font-semibold" style={{ marginBottom: 4 }}>No matching listing yet.</p>
        <p className="text-xs text-secondary">
          We'll show you when something similar becomes available on campus.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--primary-600)' }}>
        Matching Listings Nearby
      </h3>
      <div className="product-grid">
        {matches.map(listing => (
          <ProductCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
