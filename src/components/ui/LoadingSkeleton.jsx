export default function LoadingSkeleton({ type = 'card', count = 6 }) {
  if (type === 'card') {
    return (
      <div className="product-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-card" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: 0 }} />
            <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div className="skeleton skeleton-text" style={{ width: '80%' }} />
              <div className="skeleton skeleton-text" style={{ width: '40%', height: '18px' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div className="skeleton skeleton-text" style={{ width: '70%' }} />
              <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <div className="skeleton" style={{ width: '100%', aspectRatio: '4/3', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-4)' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '24px', marginBottom: 'var(--space-3)' }} />
        <div className="skeleton skeleton-text" style={{ width: '30%', height: '20px', marginBottom: 'var(--space-4)' }} />
        <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: 'var(--space-2)' }} />
        <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: 'var(--space-6)' }} />
        <div className="skeleton" style={{ width: '100%', height: 48, borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  return null;
}
