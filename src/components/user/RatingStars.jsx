import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, onSelect, readOnly = false, size = 24 }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onSelect && onSelect(star)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= rating ? '#f59e0b' : 'var(--border-primary)',
            transition: 'transform var(--transition-fast)',
          }}
          aria-label={`Rate ${star} star`}
        >
          <Star size={size} fill={star <= rating ? '#f59e0b' : 'none'} />
        </button>
      ))}
    </div>
  );
}
