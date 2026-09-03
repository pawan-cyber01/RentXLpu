import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { REPORT_REASONS } from '../../lib/constants';

export default function ReportModal({ isOpen, onClose, targetId, targetType = 'listing' }) {
  const { user } = useAuth();
  const toast = useToast();

  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'reports'), {
        reporterId: user.uid,
        targetId,
        targetType,
        reason,
        description: description.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast.success('✓ Report submitted for admin review.');
      onClose();
    } catch (err) {
      console.error('Error submitting report:', err);
      toast.error('Failed to submit report.');
    }
    setSubmitting(false);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Report {targetType}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Reason *</label>
            <select className="input" value={reason} onChange={e => setReason(e.target.value)}>
              {REPORT_REASONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Description / Context</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Provide details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? <span className="spinner" /> : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
