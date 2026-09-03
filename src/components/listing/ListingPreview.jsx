import { MapPin, Tag } from 'lucide-react';
import { formatPrice, formatRentPrice, getConditionLabel } from '../../lib/utils';
import { CONDITION_COLORS } from '../../lib/constants';

export default function ListingPreview({ formData, images, onEdit, onPublish, publishing }) {
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const showSell = formData.listingType === 'sell' || formData.listingType === 'both';
  const showRent = formData.listingType === 'rent' || formData.listingType === 'both';
  const conditionColor = CONDITION_COLORS[formData.condition] || 'var(--text-secondary)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Preview Listing</h2>
        <p className="text-sm text-secondary">Review how your listing will appear to buyers and renters.</p>
      </div>

      {/* Card Preview */}
      <div className="card" style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>
        <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-tertiary)' }}>
          {primaryImage ? (
            <img
              src={primaryImage.imageData}
              alt={formData.productName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="flex-center" style={{ height: '100%', fontSize: 'var(--text-3xl)' }}>📦</div>
          )}
          <span className="badge badge-primary" style={{ position: 'absolute', top: 8, left: 8 }}>
            {formData.listingType === 'both' ? 'Sale & Rent' : formData.listingType === 'rent' ? 'Rent' : 'Sell'}
          </span>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span className="badge badge-neutral" style={{ width: 'fit-content' }}>{formData.category}</span>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>{formData.productName}</h3>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'baseline' }}>
            {showSell && (
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-extrabold)', color: 'var(--primary-600)' }}>
                {formatPrice(formData.sellPrice)}
              </span>
            )}
            {showRent && (
              <span style={{ fontSize: showSell ? 'var(--text-xs)' : 'var(--text-lg)', fontWeight: showSell ? 'var(--font-medium)' : 'var(--font-bold)', color: showSell ? 'var(--text-secondary)' : 'var(--primary-600)' }}>
                {formatRentPrice(formData.rentPrice)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            <MapPin size={14} />
            <span>{formData.location === 'Other' ? formData.customAddress || 'Other' : formData.location}</span>
            <span>·</span>
            <span style={{ color: conditionColor, fontWeight: 'var(--font-medium)' }}>
              {getConditionLabel(formData.condition)}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 400, margin: '0 auto', width: '100%' }}>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={onEdit}
          disabled={publishing}
          style={{ flex: 1 }}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onPublish}
          disabled={publishing}
          style={{ flex: 2 }}
        >
          {publishing ? (
            <span className="spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} />
          ) : (
            'Publish Listing'
          )}
        </button>
      </div>
    </div>
  );
}
