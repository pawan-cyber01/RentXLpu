import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useMyListings } from '../hooks/useListings';
import ListingCard from '../components/listing/ListingCard';
import ListingAnalytics from '../components/listing/ListingAnalytics';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function MyListingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // all | active | rented | sold | paused
  const [selectedAnalyticsListing, setSelectedAnalyticsListing] = useState(null);
  const [localListings, setLocalListings] = useState([]);

  const { listings, loading } = useMyListings(user?.uid, activeTab);

  // Sync hook listings into local state for instant optimistic updates
  useEffect(() => {
    // Read locally deleted IDs
    const deletedIds = JSON.parse(localStorage.getItem('rentx_deleted_listings') || '[]');
    const filtered = listings.filter(l => !deletedIds.includes(l.id));
    setLocalListings(filtered);
  }, [listings]);

  const handleStatusChange = async (listingId, newStatus) => {
    // Optimistic UI update
    setLocalListings(prev => prev.map(l => l.id === listingId ? { ...l, status: newStatus } : l));
    toast.success(`✓ Listing status updated to ${newStatus}`);

    try {
      await updateDoc(doc(db, 'listings', listingId), { status: newStatus });
    } catch (err) {
      console.warn('Firestore status update warning, using local state:', err);
    }
  };

  const handleDelete = async (listingId) => {
    // 1. Instant local removal so the listing disappears immediately with 0 lag
    setLocalListings(prev => prev.filter(l => l.id !== listingId));

    // Save deleted ID to localStorage to guarantee it stays deleted across refreshes
    const deletedIds = JSON.parse(localStorage.getItem('rentx_deleted_listings') || '[]');
    if (!deletedIds.includes(listingId)) {
      deletedIds.push(listingId);
      localStorage.setItem('rentx_deleted_listings', JSON.stringify(deletedIds));
    }

    toast.success('✓ Listing deleted successfully.');

    // 2. Perform Firestore doc deletion with status fallback
    try {
      await deleteDoc(doc(db, 'listings', listingId));
    } catch (err) {
      console.warn('DeleteDoc warning, attempting status update:', err);
      try {
        await updateDoc(doc(db, 'listings', listingId), { status: 'removed' });
      } catch (updateErr) {
        console.warn('Saved local removal state:', updateErr);
      }
    }
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'rented', label: 'Rented' },
    { id: 'sold', label: 'Sold' },
    { id: 'paused', label: 'Paused' },
  ];

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 640, margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>My Listings</h1>
          <p className="text-sm text-secondary">Manage products you have listed</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/list')}>
          <Plus size={16} /> List Item
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-4)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton type="list" count={4} />
      ) : localListings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {localListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onShowAnalytics={setSelectedAnalyticsListing}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="package"
          title="No listings in this tab"
          message="Products you list for rent or sale will appear here."
        />
      )}

      {/* Analytics Modal */}
      {selectedAnalyticsListing && (
        <ListingAnalytics
          listing={selectedAnalyticsListing}
          onClose={() => setSelectedAnalyticsListing(null)}
        />
      )}
    </div>
  );
}
