import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import RatingStars from '../components/user/RatingStars';

export default function RateSellerPage() {
  const { sellerId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !sellerId) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'sellerReviews'), {
        sellerId,
        reviewerId: user.uid,
        reviewerName: user.displayName || 'Campus Buyer',
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });

      toast.success('✓ Seller rating submitted!');
      navigate(-1);
    } catch (err) {
      console.error('Error rating seller:', err);
      toast.error('Failed to submit seller rating.');
    }
    setSubmitting(false);
  };

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 500, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Rate Seller</h1>
        <p className="text-sm text-secondary">How was your transaction with this seller?</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="flex-center" style={{ margin: 'var(--space-2) 0' }}>
          <RatingStars rating={rating} onSelect={setRating} size={36} />
        </div>

        <div className="input-group">
          <label className="input-label">Written Review (Optional)</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Fast response, good product condition..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={submitting}>
          {submitting ? <span className="spinner" /> : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
}
