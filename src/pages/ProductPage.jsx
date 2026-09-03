import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, MessageCircle, Heart, Share2, ShieldAlert, ShoppingBag, RefreshCw } from 'lucide-react';
import { useListing } from '../hooks/useListings';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ProductGallery from '../components/marketplace/ProductGallery';
import SellerCard from '../components/user/SellerCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { formatPrice, formatRentPrice, getConditionLabel } from '../lib/utils';
import { CONDITION_COLORS } from '../lib/constants';

export default function ProductPage() {
  const { id } = useParams();
  const { listing, images, loading } = useListing(id);
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isFavorited, setIsFavorited] = useState(false);

  if (loading) {
    return (
      <div className="page-content" style={{ padding: 'var(--space-4)' }}>
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page-centered" style={{ flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h2>Listing Not Found</h2>
        <p className="text-secondary text-sm">This product may have been removed or deleted.</p>
        <button className="btn btn-primary" onClick={() => navigate('/buy')}>Back to Marketplace</button>
      </div>
    );
  }

  const showSell = listing.listingType === 'sell' || listing.listingType === 'both';
  const showRent = listing.listingType === 'rent' || listing.listingType === 'both';
  const conditionColor = CONDITION_COLORS[listing.condition] || 'var(--text-secondary)';
  const isOwner = user?.uid === listing.sellerId;

  const handleChatWithLister = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isOwner) {
      toast.info("This is your own listing.");
      return;
    }
    // Navigate to chat with query params to auto-create conversation
    navigate(`/chat?listingId=${listing.id}&sellerId=${listing.sellerId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.productName,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 720, margin: '0 auto' }}>
      {/* Top Gallery */}
      <ProductGallery images={images} productName={listing.productName} />

      {/* Main Listing Info */}
      <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div className="flex-between">
          <span className="badge badge-primary">{listing.category}</span>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn-icon btn-ghost btn-sm" onClick={handleShare} aria-label="Share">
              <Share2 size={18} />
            </button>
            <button
              className="btn-icon btn-ghost btn-sm"
              onClick={() => setIsFavorited(!isFavorited)}
              aria-label="Favorite"
            >
              <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : 'currentColor'} />
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>
          {listing.productName}
        </h1>

        {/* Pricing Block */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-xl)',
          width: 'fit-content',
        }}>
          {showSell && (
            <div>
              <span className="text-xs text-tertiary font-medium">Sale Price</span>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary-600)' }}>
                {formatPrice(listing.sellPrice)}
              </div>
            </div>
          )}

          {showRent && (
            <div>
              <span className="text-xs text-tertiary font-medium">Rent Price</span>
              <div style={{ fontSize: showSell ? 'var(--text-lg)' : 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: showSell ? 'var(--text-secondary)' : 'var(--primary-600)' }}>
                {formatRentPrice(listing.rentPrice)}
              </div>
            </div>
          )}
        </div>

        {/* Location & Condition */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={16} color="var(--primary-500)" />
            {listing.location === 'Other' ? listing.customAddress : listing.location}
          </span>
          <span>·</span>
          <span style={{ color: conditionColor, fontWeight: 'var(--font-semibold)' }}>
            Condition: {getConditionLabel(listing.condition)}
          </span>
        </div>
      </div>

      {/* Seller Card */}
      <SellerCard sellerId={listing.sellerId} sellerName={listing.sellerName} />

      {/* CRITICAL REQUIREMENT: Chat with Lister button placed directly underneath listing info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={handleChatWithLister}
          style={{
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
            fontSize: 'var(--text-base)',
            boxShadow: 'var(--shadow-glow-strong)',
          }}
        >
          <MessageCircle size={22} />
          💬 Chat with Lister
        </button>

        {/* Conditional Action Buttons */}
        {!isOwner && (
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {showSell && (
              <button
                className="btn btn-secondary btn-lg"
                style={{ flex: 1 }}
                onClick={handleChatWithLister}
              >
                <ShoppingBag size={18} /> Buy Now
              </button>
            )}
            {showRent && (
              <button
                className="btn btn-outline btn-lg"
                style={{ flex: 1 }}
                onClick={handleChatWithLister}
              >
                <RefreshCw size={18} /> Rent Now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Analytics Footer */}
      <div className="flex-between text-xs text-tertiary" style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-primary)' }}>
        <span>👀 {listing.views || 1} views</span>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--text-tertiary)' }}
          onClick={() => toast.info('Report submitted for admin review.')}
        >
          <ShieldAlert size={14} /> Report Listing
        </button>
      </div>
    </div>
  );
}
