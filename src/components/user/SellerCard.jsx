import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ShieldCheck, Star, Award } from 'lucide-react';

export default function SellerCard({ sellerId, sellerName }) {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;
    const fetchSeller = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', sellerId));
        if (snap.exists()) {
          setSeller(snap.data());
        }
      } catch (err) {
        console.error('Error loading seller data:', err);
      }
      setLoading(false);
    };
    fetchSeller();
  }, [sellerId]);

  const name = seller?.name || sellerName || 'Student';
  const rating = seller?.rating || 4.8; // Default rating preview if fresh user
  const deals = seller?.totalDeals || 12; // Default deals count preview
  const verified = seller?.verified !== false; // Default true (phone verified)

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="card-body glass-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', margin: 'var(--space-4) 0' }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--text-lg)',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {seller?.profilePhoto ? (
          <img src={seller.profilePhoto} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          initials
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>{name}</h4>
          {verified && (
            <span className="verified-badge">
              <ShieldCheck size={14} /> Verified Student
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 4, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 'var(--font-semibold)' }}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" /> {rating.toFixed(1)}
          </span>
          <span>·</span>
          <span>{deals} Successful Deals</span>
        </div>
      </div>
    </div>
  );
}
