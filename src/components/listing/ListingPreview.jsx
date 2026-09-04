import { useState } from 'react';
import { MapPin, Tag, ShieldAlert, FileText, X } from 'lucide-react';
import { formatPrice, formatRentPrice, getConditionLabel } from '../../lib/utils';
import { CONDITION_COLORS } from '../../lib/constants';

export default function ListingPreview({ formData, images, onEdit, onPublish, publishing }) {
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const showSell = formData.listingType === 'sell' || formData.listingType === 'both';
  const showRent = formData.listingType === 'rent' || formData.listingType === 'both';
  const conditionColor = CONDITION_COLORS[formData.condition] || 'var(--text-secondary)';

  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Preview</h2>
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

      {/* Disclaimer Box */}
      <div style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--warning)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={18} color="var(--warning)" />
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', margin: 0 }}>Disclaimer</h4>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          For rentals, take a security deposit (money, ID verification, or another mutually agreed security) before handing over the item.
          <strong style={{ color: 'var(--text-primary)' }}> RentX is not responsible for damage, loss, theft, payment issues, or disputes between users.</strong>
        </p>
      </div>

      {/* Terms & Conditions Link + Checkbox */}
      <div style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={18} color="var(--primary-500)" />
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', margin: 0 }}>Terms & Conditions</h4>
        </div>

        <button
          type="button"
          onClick={() => setShowTerms(true)}
          style={{
            background: 'none', border: 'none', padding: 0,
            color: 'var(--primary-500)', fontSize: '13px', fontWeight: 'var(--font-semibold)',
            cursor: 'pointer', textDecoration: 'underline', textAlign: 'left',
          }}
        >
          View Terms & Conditions →
        </button>

        <label style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          cursor: 'pointer', fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5,
        }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginTop: 3, accentColor: 'var(--primary-500)', width: 18, height: 18, flexShrink: 0 }}
          />
          <span>
            <strong>I agree to the Terms & Conditions and accept the disclaimer.</strong>
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: 400, margin: '0 auto', width: '100%' }}>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={onEdit}
          disabled={publishing}
          style={{ flex: 1 }}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onPublish}
          disabled={publishing || !agreed}
          style={{ flex: 2, opacity: agreed ? 1 : 0.5 }}
        >
          {publishing ? (
            <span className="spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} />
          ) : (
            'Publish'
          )}
        </button>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="overlay" style={{ zIndex: 1000 }}>
          <div className="modal glass-card" style={{
            width: '92%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto',
            padding: 'var(--space-5)', position: 'relative',
          }}>
            <button
              className="btn-icon btn-ghost"
              onClick={() => setShowTerms(false)}
              style={{ position: 'absolute', top: 12, right: 12 }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-4)', paddingRight: 32 }}>
              RentX — Listing Terms & Conditions
            </h2>

            <p style={{ fontSize: '13px', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              By listing an item on RentX, you agree to the following rules:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>1. Item Responsibility</h4>
                <p style={{ margin: 0 }}>The lister is responsible for the item's condition, description, ownership, pricing, availability, and any promises made to the renter/buyer.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>2. Rental Security Deposit</h4>
                <p style={{ margin: 0 }}>For rental items, the lister should collect a mutually agreed <strong>refundable security deposit before handing over the item</strong>. The deposit amount and return conditions should be clearly agreed upon by both parties before the rental.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>3. ID Verification</h4>
                <p style={{ margin: 0 }}>For rentals, the lister may ask the renter to show a valid college/student ID for verification before handing over the item.</p>
                <p style={{ margin: '4px 0 0', fontWeight: 'var(--font-semibold)', color: 'var(--error)' }}>Do not upload or send an ID card photo through RentX chat.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>4. Damage or Loss</h4>
                <p style={{ margin: 0 }}>RentX is a marketplace platform and is <strong>not responsible for damage, loss, theft, misuse, late return, non-return, or disputes involving rented or sold items</strong>. The buyer/renter and lister are responsible for resolving their transaction according to their agreed terms and applicable law.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>5. Payment & Transactions</h4>
                <p style={{ margin: 0 }}>RentX does not guarantee payments or transactions between users. Users should verify the item, price, condition, security deposit, and other terms before completing a transaction.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>6. Meet Safely</h4>
                <p style={{ margin: 0 }}>Whenever possible, meet in a safe/public campus location. Do not share unnecessary personal information.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>7. Accurate Listings</h4>
                <p style={{ margin: 0 }}>Do not post fake, misleading, stolen, illegal, dangerous, or prohibited items. Product images and descriptions must accurately represent the item.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>8. No Circumventing Bans</h4>
                <p style={{ margin: 0 }}>Users who are suspended or banned must not create another account to bypass RentX restrictions.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>9. Reports & Moderation</h4>
                <p style={{ margin: 0 }}>RentX may hide or remove listings and suspend/ban accounts that violate these rules or receive credible reports.</p>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', marginBottom: 4 }}>10. Platform Limitation</h4>
                <p style={{ margin: 0 }}>RentX provides the marketplace and communication platform but does not become a party to the transaction between users. Users are responsible for making their own decisions and verifying the person and item involved.</p>
              </div>

              {/* Important Callout */}
              <div style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--warning)',
                color: '#101010',
              }}>
                <p style={{ margin: 0, fontWeight: 'var(--font-bold)', fontSize: '12px' }}>
                  ⚠️ For rentals, clearly agree on:
                </p>
                <p style={{ margin: '4px 0 0', fontWeight: 'var(--font-semibold)', fontSize: '11px' }}>
                  Item condition · Rent price · Security deposit · Rental duration · Return date · Damage/late-return terms
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '11px' }}>
                  — before handing over the item.
                </p>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => setShowTerms(false)}
              style={{ marginTop: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
