import { CATEGORIES } from '../../lib/constants';
import * as Icons from 'lucide-react';

export default function CategoryChips({ selected, onSelect }) {
  return (
    <div className="category-chips">
      <button
        className={`category-chip ${!selected || selected === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        <div className="category-chip-icon">
          <Icons.LayoutGrid size={22} />
        </div>
        <span className="category-chip-label">All</span>
      </button>

      {CATEGORIES.map(cat => {
        const IconComponent = Icons[cat.icon] || Icons.Package;
        return (
          <button
            key={cat.id}
            className={`category-chip ${selected === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            <div className="category-chip-icon">
              <IconComponent size={22} />
            </div>
            <span className="category-chip-label">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
