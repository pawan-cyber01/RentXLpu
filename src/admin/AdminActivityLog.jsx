import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { timeAgo } from '../lib/utils';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function AdminActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, 'adminLogs'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching admin logs:', err);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Admin Activity Log</h1>
        <p className="text-sm text-secondary">Audit trail of all administrative actions, bans, and moderation events</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="list" count={4} />
      ) : (
        <div className="glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {logs.length > 0 ? (
            logs.map(log => (
              <div key={log.id} className="flex-between" style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                <div>
                  <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--primary-600)' }}>{log.action}</span>
                  {log.reason && <span className="text-tertiary"> — Reason: {log.reason}</span>}
                </div>
                <span className="text-tertiary">{log.timestamp?.toDate ? timeAgo(log.timestamp.toDate()) : 'Recently'}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-tertiary">No administrative actions logged yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
