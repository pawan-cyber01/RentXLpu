import { useState } from 'react';
import { CATEGORIES } from '../lib/constants';

export default function AdminCategories() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategories(prev => [...prev, { id: newCategory.toLowerCase().replace(/\s+/g, '-'), name: newCategory.trim(), icon: 'Package' }]);
    setNewCategory('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Category Management</h1>
        <p className="text-sm text-secondary">Add, rename, reorder, or toggle marketplace categories</p>
      </div>

      <form onSubmit={handleAdd} className="glass-card card-body" style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 500 }}>
        <input
          type="text"
          className="input"
          placeholder="New Category Name..."
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>Add</button>
      </form>

      <div className="glass-card card-body" style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {categories.map(c => (
          <div key={c.id} className="flex-between" style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontWeight: 'var(--font-semibold)' }}>{c.name}</span>
            <span className="text-xs text-tertiary">{c.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
