import { Check } from 'lucide-react';
import { SORT_OPTIONS } from '../../lib/constants';

export default function SortSheet({ isOpen, onClose, selected, onSelect }) {
  if (!isOpen) return null;

  const handleSelect = (id) => {
    onSelect(id);
    onClose();
  };

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet" role="dialog" aria-label="Sort options" style={{ maxHeight: '50vh' }}>
        <div className="bottom-sheet-handle" />
        <div className="bottom-sheet-header">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Sort By</h3>
          <button className="btn btn-ghost btn-icon-sm" onClick={onClose} aria-label="Close">
            <span style={{ fontSize: 'var(--text-lg)' }}>×</span>
          </button>
        </div>

        <div className="bottom-sheet-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {SORT_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: selected === option.id ? 'var(--primary-50)' : 'transparent',
                  color: selected === option.id ? 'var(--primary-600)' : 'var(--text-primary)',
                  fontWeight: selected === option.id ? 'var(--font-semibold)' : 'var(--font-regular)',
                  fontSize: 'var(--text-base)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {option.label}
                {selected === option.id && <Check size={18} color="var(--primary-500)" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
