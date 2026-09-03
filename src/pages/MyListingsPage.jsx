import { useState } from 'react';
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

  const { listings, loading } = useMyListings(user?.uid, activeTab);

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await updateDoc(doc(db, 'listings', listingId), { status: newStatus });
      toast.success(`✓ Listing status changed to ${newStatus}`);
      window.location.reload();
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (listingId) => {
    try {
      // Soft-delete or update status to 'removed' to preserve audit compliance
      await updateDoc(doc(db, 'listings', listingId), { status: 'removed' });
      toast.success('✓ Listing deleted.');
      window.location.reload();
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast.error('Failed to delete listing.');
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
      ) : listings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {listings.map(listing => (
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

      {selectedAnalyticsListing && (
        <ListingAnalytics
          listing={selectedAnalyticsListing}
          onClose={() => setSelectedAnalyticsListing(null)}
        />
      )}
    </div>
  );
}
