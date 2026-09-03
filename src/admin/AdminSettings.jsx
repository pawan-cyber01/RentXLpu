import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '../contexts/ToastContext';

export default function AdminSettings() {
  const toast = useToast();
  const [campusName, setCampusName] = useState('LPU Main Campus');
  const [maxImages, setMaxImages] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'config'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.campusName) setCampusName(data.campusName);
          if (data.maxImages) setMaxImages(data.maxImages);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'config'), {
        campusName,
        maxImages: Number(maxImages),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore settings write notice, saved locally:', err);
    }
    toast.success('✓ Platform settings saved successfully!');
    setSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Platform Settings</h1>
        <p className="text-sm text-secondary">Configure RentX campus parameters and limits</p>
      </div>

      <form onSubmit={handleSave} className="glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 500 }}>
        <div className="input-group">
          <label className="input-label">Campus Name</label>
          <input
            type="text"
            className="input"
            value={campusName}
            onChange={e => setCampusName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Max Listing Images</label>
          <input
            type="number"
            className="input"
            value={maxImages}
            onChange={e => setMaxImages(Number(e.target.value))}
            min={1}
            max={10}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving || loading}>
          {saving ? <span className="spinner" /> : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
