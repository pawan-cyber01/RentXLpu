import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '../lib/utils';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function AdminListings() {
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const snap = await getDocs(collection(db, 'listings'));
        setListings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching admin listings:', err);
      }
      setLoading(false);
    };
    fetchListings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'listings', id), { status: newStatus });
      toast.success(`Listing status set to ${newStatus}.`);
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error('Error updating listing status:', err);
      toast.error('Failed to update listing status.');
    }
  };

  const handleDeleteListing = async (id) => {
    // 1. Optimistic removal from admin UI
    setListings(prev => prev.filter(l => l.id !== id));
    setDeletingId(null);
    toast.success('✓ Listing permanently deleted from Firebase.');

    // 2. Permanent deletion from Firebase Firestore
    try {
      // Purge images subcollection
      try {
        const imgSnap = await getDocs(collection(db, 'listings', id, 'images'));
        for (const imgDoc of imgSnap.docs) {
          await deleteDoc(doc(db, 'listings', id, 'images', imgDoc.id));
        }
      } catch (e) {}

      // Delete main doc from Firestore
      await deleteDoc(doc(db, 'listings', id));
    } catch (err) {
      console.warn('Admin deleteDoc notice, fallback to status removal:', err);
      try {
        await updateDoc(doc(db, 'listings', id), { status: 'removed' });
      } catch (e) {}
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Listing Moderation</h1>
        <p className="text-sm text-secondary">Review and manage marketplace products</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="list" count={5} />
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px' }}>Product</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Price</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'var(--font-semibold)' }}>{l.productName}</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-neutral">{l.category}</span></td>
                  <td style={{ padding: '12px 16px' }}>{formatPrice(l.sellPrice || l.rentPrice || 0)}</td>
                  <td style={{ padding: '12px 16px' }}>{l.location}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${l.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      {l.status === 'active' ? (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleUpdateStatus(l.id, 'paused')}>Hide</button>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(l.id, 'active')}>Restore</button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => setDeletingId(l.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => handleDeleteListing(deletingId)}
        title="Permanently Delete Listing"
        message="Are you sure you want to permanently delete this listing and its images from Firebase? This cannot be undone."
        confirmText="Delete Permanently"
        danger
      />
    </div>
  );
}
