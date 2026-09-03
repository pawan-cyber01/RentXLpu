import { LOCATIONS } from '../lib/constants';

export default function AdminLocations() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Campus & Location Management</h1>
        <p className="text-sm text-secondary">Manage hostels (BH1-BH13, GH1-GH12), apartments, and future campus support</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        {LOCATIONS.map(group => (
          <div key={group.group} className="glass-card card-body">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>{group.group}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {group.items.map(item => (
                <span key={item} className="badge badge-neutral">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
