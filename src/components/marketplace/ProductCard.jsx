import { useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { formatPrice, formatRentPrice, getConditionLabel, getListingTypeLabel } from '../../lib/utils';
import { CONDITION_COLORS } from '../../lib/constants';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function ProductCard({ listing, onFavorite, isFavorited = false }) {
  const navigate = useNavigate();
  const [primaryImage, setPrimaryImage] = useState(null);

  useEffect(() => {
    // Fetch primary image from subcollection
    const fetchImage = async () => {
      try {
        const imagesQuery = query(
          collection(db, 'listings', listing.id, 'images'),
          orderBy('order', 'asc'),
          limit(1)
        );
        const snap = await getDocs(imagesQuery);
        if (!snap.empty) {
          setPrimaryImage(snap.docs[0].data().imageData);
        }
      } catch (err) {
        // Silently fail
      }
    };
    if (listing?.id) fetchImage();
  }, [listing?.id]);

  const handleClick = () => {
    navigate(`/product/${listing.id}`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    onFavorite && onFavorite(listing.id);
  };

  const showSellPrice = listing.listingType === 'sell' || listing.listingType === 'both';
  const showRentPrice = listing.listingType === 'rent' || listing.listingType === 'both';
  const conditionColor = CONDITION_COLORS[listing.condition] || 'var(--text-secondary)';

  return (
    <article
      className="product-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`${listing.productName} - ${showSellPrice ? formatPrice(listing.sellPrice) : formatRentPrice(listing.rentPrice)}`}
    >
      <div className="product-card-image">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={listing.productName}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--text-3xl)',
          }}>
            📦
          </div>
        )}

        {listing.listingType === 'both' && (
          <div className="product-card-type-badge">
            <span className="badge badge-primary">Sale & Rent</span>
          </div>
        )}

        <button
          className={`product-card-favorite ${isFavorited ? 'active' : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">{listing.productName}</h3>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {showSellPrice && (
            <span className="product-card-price">{formatPrice(listing.sellPrice)}</span>
          )}
          {showRentPrice && (
            <span className={showSellPrice ? 'product-card-rent-price' : 'product-card-price'}>
              {showSellPrice ? `${formatRentPrice(listing.rentPrice)}` : formatRentPrice(listing.rentPrice)}
            </span>
          )}
        </div>

        <div className="product-card-meta">
          <MapPin size={12} />
          <span>{listing.location}</span>
          <span>·</span>
          <span className="product-card-condition" style={{ color: conditionColor }}>
            {getConditionLabel(listing.condition)}
          </span>
        </div>
      </div>
    </article>
  );
}
