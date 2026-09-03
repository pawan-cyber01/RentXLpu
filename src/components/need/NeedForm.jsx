import { useState } from 'react';
import { CATEGORIES, LOCATIONS } from '../../lib/constants';

export default function NeedForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    location: '',
    budget: '',
    neededBy: 'Tomorrow',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.productName.trim()) errs.productName = 'Specify what you need';
    if (!formData.category) errs.category = 'Select a category';
    if (!formData.location) errs.location = 'Select location';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit({
      ...formData,
      productName: formData.productName.trim(),
      budget: formData.budget ? Number(formData.budget) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Post a Need</h3>

      <div className="input-group">
        <label className="input-label">What do you need? *</label>
        <input
          type="text"
          className={`input ${errors.productName ? 'input-error' : ''}`}
          placeholder="e.g. Scientific Calculator"
          value={formData.productName}
          onChange={e => setFormData({ ...formData, productName: e.target.value })}
        />
        {errors.productName && <span className="input-error-text">{errors.productName}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div className="input-group">
          <label className="input-label">Category *</label>
          <select
            className={`input ${errors.category ? 'input-error' : ''}`}
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <span className="input-error-text">{errors.category}</span>}
        </div>

        <div className="input-group">
          <label className="input-label">Location *</label>
          <select
            className={`input ${errors.location ? 'input-error' : ''}`}
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          >
            <option value="">Select</option>
            {LOCATIONS.flatMap(g => g.items).map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && <span className="input-error-text">{errors.location}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
        <div className="input-group">
          <label className="input-label">Budget (₹) (Optional)</label>
          <input
            type="number"
            className="input"
            placeholder="e.g. 500"
            value={formData.budget}
            onChange={e => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Needed By</label>
          <select
            className="input"
            value={formData.neededBy}
            onChange={e => setFormData({ ...formData, neededBy: e.target.value })}
          >
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="This Week">This Week</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
        {loading ? <span className="spinner" /> : 'POST NEED'}
      </button>
    </form>
  );
}
