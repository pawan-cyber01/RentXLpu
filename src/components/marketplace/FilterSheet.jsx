import { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { CATEGORIES, LOCATIONS, CONDITIONS, LISTING_TYPES } from '../../lib/constants';

export default function FilterSheet({ isOpen, onClose, filters, onApply }) {
  const [local, setLocal] = useState({
    category: 'all',
    location: '',
    type: '',
    minPrice: 0,
    maxPrice: 50000,
    condition: '',
    availability: '',
  });

  useEffect(() => {
    if (filters) setLocal({ ...local, ...filters });
  }, [filters, isOpen]);

  const handleReset = () => {
    setLocal({
      category: 'all',
      location: '',
      type: '',
      minPrice: 0,
      maxPrice: 50000,
      condition: '',
      availability: '',
    });
  };

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet" role="dialog" aria-label="Filters">
        <div className="bottom-sheet-handle" />
        <div className="bottom-sheet-header">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Filters</h3>
          <button className="btn btn-ghost btn-sm" onClick={handleReset}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="bottom-sheet-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Category */}
          <div>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <ChipButton active={local.category === 'all'} onClick={() => setLocal(p => ({ ...p, category: 'all' }))}>All</ChipButton>
              {CATEGORIES.map(c => (
                <ChipButton key={c.id} active={local.category === c.id} onClick={() => setLocal(p => ({ ...p, category: c.id }))}>{c.name}</ChipButton>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Location</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {LOCATIONS.map(group => (
                <div key={group.group}>
                  <span className="text-xs text-tertiary font-semibold" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>{group.group}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {group.items.map(loc => (
                      <ChipButton key={loc} active={local.location === loc} onClick={() => setLocal(p => ({ ...p, location: p.location === loc ? '' : loc }))} small>{loc}</ChipButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Type</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <ChipButton active={!local.type} onClick={() => setLocal(p => ({ ...p, type: '' }))}>All</ChipButton>
              {LISTING_TYPES.map(t => (
                <ChipButton key={t.id} active={local.type === t.id} onClick={() => setLocal(p => ({ ...p, type: t.id }))}>{t.label}</ChipButton>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Price Range</label>
            <div className="price-slider">
              <div className="price-slider-labels">
                <span>₹{local.minPrice.toLocaleString('en-IN')}</span>
                <span>₹{local.maxPrice.toLocaleString('en-IN')}+</span>
              </div>
              <div className="price-slider-track">
                <div
                  className="price-slider-range"
                  style={{
                    left: `${(local.minPrice / 50000) * 100}%`,
                    right: `${100 - (local.maxPrice / 50000) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={local.minPrice}
                  onChange={(e) => setLocal(p => ({ ...p, minPrice: Math.min(Number(e.target.value), p.maxPrice - 500) }))}
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={local.maxPrice}
                  onChange={(e) => setLocal(p => ({ ...p, maxPrice: Math.max(Number(e.target.value), p.minPrice + 500) }))}
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Condition</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <ChipButton active={!local.condition} onClick={() => setLocal(p => ({ ...p, condition: '' }))}>All</ChipButton>
              {CONDITIONS.map(c => (
                <ChipButton key={c.id} active={local.condition === c.id} onClick={() => setLocal(p => ({ ...p, condition: c.id }))}>{c.label}</ChipButton>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-sheet-footer">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleApply}>Apply Filters</button>
        </div>
      </div>
    </>
  );
}

function ChipButton({ children, active, onClick, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? '0.3rem 0.6rem' : '0.4rem 0.85rem',
        fontSize: small ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        borderRadius: 'var(--radius-full)',
        border: active ? '1.5px solid var(--primary-500)' : '1.5px solid var(--border-primary)',
        background: active ? 'var(--primary-500)' : 'transparent',
        color: active ? '#ffffff' : 'var(--text-secondary)',
        transition: 'all var(--transition-fast)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
