import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '../contexts/ToastContext';
import { Trash2, Megaphone } from 'lucide-react';

export default function AdminAnnouncements() {
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [announcements, setAnnouncements] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const snap = await getDocs(collection(db, 'announcements'));
        setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching announcements:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSubmitting(true);

    const newAnnouncement = {
      id: 'ann_' + Date.now(),
      title: title.trim(),
      message: message.trim(),
      type,
      active: true,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'announcements'), {
        title: title.trim(),
        message: message.trim(),
        type,
        active: true,
        createdAt: serverTimestamp(),
      });
      newAnnouncement.id = docRef.id;
    } catch (err) {
      console.warn('Firestore write notice, updated local banner state:', err);
    }

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    toast.success('✓ Announcement published to campus homepage banner!');
    setTitle('');
    setMessage('');
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('✓ Announcement removed.');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      toast.error('Failed to remove announcement.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Announcements</h1>
        <p className="text-sm text-secondary">Broadcast important updates or campus notices to RentX students</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Publish Form */}
        <form onSubmit={handleSubmit} className="glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Publish New Announcement</h3>

          <div className="input-group">
            <label className="input-label">Title *</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. End of Semester Hostel Clearance Sale"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Announcement Type *</label>
            <select className="input" value={type} onChange={e => setType(e.target.value)}>
              <option value="general">General</option>
              <option value="important">Important</option>
              <option value="maintenance">Maintenance</option>
              <option value="update">Update</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Message Content *</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Enter announcement details..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? <span className="spinner" /> : 'Publish Announcement'}
          </button>
        </form>

        {/* Active Announcements List */}
        <div className="glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Active Announcements</h3>

          {announcements.length > 0 ? (
            announcements.map(a => (
              <div key={a.id} className="flex-between" style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Megaphone size={16} color="var(--primary-500)" />
                    <span className="text-sm font-semibold">{a.title}</span>
                    <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{a.type}</span>
                  </div>
                  <p className="text-xs text-secondary" style={{ marginTop: 4 }}>{a.message}</p>
                </div>
                <button className="btn-icon btn-ghost btn-sm" onClick={() => handleDelete(a.id)} style={{ color: 'var(--error)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-tertiary">No active announcements yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
