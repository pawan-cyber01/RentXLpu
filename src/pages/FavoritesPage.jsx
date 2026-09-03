import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/marketplace/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const listingIds = snap.docs.map(d => d.data().listingId);

        if (listingIds.length > 0) {
          const listingsSnap = await getDocs(query(collection(db, 'listings'), where('__name__', 'in', listingIds)));
          setFavorites(listingsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Favorites</h1>
        <p className="text-sm text-secondary">Items you saved for later</p>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : favorites.length > 0 ? (
        <div className="product-grid">
          {favorites.map(listing => (
            <ProductCard key={listing.id} listing={listing} isFavorited />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="heart"
          title="No favorites yet"
          message="Tap the heart icon on any listing to save it here."
        />
      )}
    </div>
  );
}
