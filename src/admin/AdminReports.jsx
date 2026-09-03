import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '../contexts/ToastContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function AdminReports() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snap = await getDocs(collection(db, 'reports'));
        setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching reports:', err);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  const handleResolveReport = async (reportId, status) => {
    try {
      await updateDoc(doc(db, 'reports', reportId), { status });
      toast.success(`Report marked as ${status}.`);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    } catch (err) {
      console.error('Error resolving report:', err);
      toast.error('Failed to update report.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Reports Queue</h1>
        <p className="text-sm text-secondary">Review user-submitted reports for scams, spam, or harassment</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="list" count={4} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {reports.map(r => (
            <div key={r.id} className="glass-card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="badge badge-error">{r.reason}</span>
                  <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>Status: {r.status || 'pending'}</span>
                </div>
                <p className="text-sm font-semibold" style={{ marginTop: 'var(--space-2)' }}>
                  Target ID: {r.targetId || 'N/A'} ({r.targetType || 'item'})
                </p>
                <p className="text-xs text-secondary" style={{ marginTop: 2 }}>{r.description || 'No description provided'}</p>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleResolveReport(r.id, 'dismissed')}>Dismiss</button>
                <button className="btn btn-primary btn-sm" onClick={() => handleResolveReport(r.id, 'resolved')}>Resolve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
