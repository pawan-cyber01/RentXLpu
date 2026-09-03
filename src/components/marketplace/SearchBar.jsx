import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search anything...', autoFocus = false }) {
  return (
    <div className="search-bar">
      <Search className="search-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search products"
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => { onChange(''); onClear && onClear(); }}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
