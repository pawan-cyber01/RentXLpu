import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from '../contexts/ToastContext';
import RatingStars from '../components/user/RatingStars';

export default function AdminReviews() {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const snap = await getDocs(collection(db, 'reviews'));
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching platform reviews:', err);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const handleToggleHide = async (id, currentHidden) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { hidden: !currentHidden });
      toast.success(currentHidden ? 'Review restored.' : 'Review hidden.');
      setReviews(prev => prev.map(r => r.id === id ? { ...r, hidden: !currentHidden } : r));
    } catch (err) {
      console.error('Error updating review:', err);
      toast.error('Failed to update review status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Platform Reviews Moderation</h1>
        <p className="text-sm text-secondary">Moderate RentX feedback and hide inappropriate or abusive reviews without altering ratings</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {reviews.map(r => (
          <div key={r.id} className="glass-card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <RatingStars rating={r.rating} readOnly size={16} />
                <span className="text-sm font-semibold">{r.userName || 'Student'}</span>
                {r.hidden && <span className="badge badge-error">Hidden</span>}
              </div>
              <p className="text-xs text-secondary" style={{ marginTop: 4 }}>{r.suggestion || 'No written suggestion'}</p>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => handleToggleHide(r.id, r.hidden)}>
              {r.hidden ? 'Restore' : 'Hide'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
