import { useState, useEffect } from 'react';
import { Search, Shield, Ban, AlertTriangle, CheckCircle } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { maskPhone, timeAgo } from '../lib/utils';
import Modal from '../components/ui/Modal';

export default function AdminUsers() {
  const { user: adminUser } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Ban Modal state
  const [banModalUser, setBanModalUser] = useState(null);
  const [banDuration, setBanDuration] = useState('24 hours');
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error loading users:', err);
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId, newStatus, reason = '') => {
    try {
      await updateDoc(doc(db, 'users', userId), { status: newStatus });

      // Log admin activity
      await addDoc(collection(db, 'adminLogs'), {
        adminId: adminUser.uid,
        action: `User status changed to ${newStatus}`,
        targetId: userId,
        targetType: 'user',
        reason,
        timestamp: serverTimestamp(),
      });

      toast.success(`User status updated to ${newStatus}.`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('Failed to update status.');
    }
  };

  const handleBanSubmit = async (e) => {
    e.preventDefault();
    if (!banModalUser || !banReason.trim()) {
      toast.error('Ban reason is required');
      return;
    }
    await handleUpdateStatus(banModalUser.id, `banned (${banDuration})`, banReason);
    setBanModalUser(null);
    setBanReason('');
  };

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phoneNumber || '').includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>User Management</h1>
          <p className="text-sm text-secondary">Manage campus student accounts and moderation status</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: 400 }}>
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)' }}>
              <th style={{ padding: '12px 16px' }}>Student</th>
              <th style={{ padding: '12px 16px' }}>Phone</th>
              <th style={{ padding: '12px 16px' }}>Verification</th>
              <th style={{ padding: '12px 16px' }}>Rating</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'var(--font-semibold)' }}>
                  {u.name || 'Anonymous Student'}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                  {maskPhone(u.phoneNumber || '')}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className="badge badge-success">✓ Verified</span>
                </td>
                <td style={{ padding: '12px 16px' }}>⭐ {u.rating || 4.8}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-error'}`} style={{ textTransform: 'capitalize' }}>
                    {u.status || 'active'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleUpdateStatus(u.id, 'warned', 'Warning issued')}
                      title="Warn User"
                    >
                      <AlertTriangle size={14} color="var(--warning)" />
                    </button>
                    {u.status?.includes('banned') ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleUpdateStatus(u.id, 'active', 'Ban lifted')}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setBanModalUser(u)}
                      >
                        Ban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ban Options Modal */}
      <Modal isOpen={!!banModalUser} onClose={() => setBanModalUser(null)} title={`Ban User: ${banModalUser?.name || 'Student'}`}>
        <form onSubmit={handleBanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label className="input-label">Ban Duration *</label>
            <select className="input" value={banDuration} onChange={e => setBanDuration(e.target.value)}>
              <option value="24 hours">24 Hours</option>
              <option value="7 days">7 Days</option>
              <option value="30 days">30 Days</option>
              <option value="Permanent">Permanent</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Mandatory Reason *</label>
            <textarea
              className="input"
              rows={3}
              placeholder="State reason for banning user..."
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setBanModalUser(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger" style={{ flex: 1 }}>Confirm Ban</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
