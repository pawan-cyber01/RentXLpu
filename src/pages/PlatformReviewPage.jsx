import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import RatingStars from '../components/user/RatingStars';

export default function PlatformReviewPage() {
  const { user, userProfile } = useAuth();
  const toast = useToast();

  const [rating, setRating] = useState(5);
  const [likes, setLikes] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);

  const LIKE_OPTIONS = [
    'Easy to use',
    'Good prices',
    'Easy chat',
    'Easy listing',
    'Renting was useful',
    'Safe & trusted',
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  const handleToggleLike = (option) => {
    setLikes(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'reviews'), {
        userId: user.uid,
        userName: userProfile?.name || 'Student User',
        rating,
        likes,
        suggestion: suggestion.trim(),
        createdAt: serverTimestamp(),
      });

      toast.success('✓ Thank you for rating RentX!');
      setSuggestion('');
      setLikes([]);
      window.location.reload();
    } catch (err) {
      console.error('Error submitting platform review:', err);
      toast.error('Failed to submit review.');
    }
    setSubmitting(false);
  };

  // Stats calculation
  const totalCount = reviews.length || 327; // Default baseline preview
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '4.8';

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Rate RentX</h1>
        <p className="text-sm text-secondary">Tell us how your overall platform experience has been.</p>
      </div>

      {/* Aggregate Stats Section */}
      <div className="glass-card card-body" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-extrabold)', color: 'var(--primary-600)' }}>
          {avgRating} <span style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>/ 5</span>
        </div>
        <RatingStars rating={Math.round(Number(avgRating))} readOnly size={20} />
        <p className="text-xs text-tertiary" style={{ marginTop: 4 }}>Based on {totalCount} reviews</p>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="glass-card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>How was your RentX experience?</h3>

        <div className="flex-center" style={{ margin: 'var(--space-2) 0' }}>
          <RatingStars rating={rating} onSelect={setRating} size={32} />
        </div>

        <div>
          <label className="input-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>What did you like?</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
            {LIKE_OPTIONS.map(opt => (
              <label
                key={opt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  background: likes.includes(opt) ? 'var(--primary-50)' : 'var(--bg-tertiary)',
                  border: likes.includes(opt) ? '1px solid var(--primary-500)' : '1px solid var(--border-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-medium)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={likes.includes(opt)}
                  onChange={() => handleToggleLike(opt)}
                  style={{ accentColor: 'var(--primary-500)' }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Suggestions / Feedback</label>
          <textarea
            className="input"
            rows={3}
            placeholder="What could we improve?"
            value={suggestion}
            onChange={e => setSuggestion(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={submitting}>
          {submitting ? <span className="spinner" /> : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
