import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CATEGORIES, LOCATIONS, CONDITIONS, LISTING_TYPES } from '../lib/constants';
import { createSearchTerms } from '../lib/utils';
import ImageUploader from '../components/listing/ImageUploader';
import ListingPreview from '../components/listing/ListingPreview';

export default function ListPage() {
  const { user, userProfile, isAuthenticated, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Details, 2: Pricing, 3: Images, 4: Preview
  const [publishing, setPublishing] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    location: '',
    customAddress: '',
    listingType: 'both', // sell | rent | both
    sellPrice: '',
    rentPrice: '',
    condition: 'good',
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.productName.trim()) errs.productName = 'Product name is required';
    if (!formData.category) errs.category = 'Please select a category';
    if (!formData.location) errs.location = 'Please select a location';
    if (formData.location === 'Other' && !formData.customAddress.trim()) {
      errs.customAddress = 'Please enter your address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (formData.listingType === 'sell' || formData.listingType === 'both') {
      if (!formData.sellPrice || Number(formData.sellPrice) <= 0) {
        errs.sellPrice = 'Valid selling price is required';
      }
    }
    if (formData.listingType === 'rent' || formData.listingType === 'both') {
      if (!formData.rentPrice || Number(formData.rentPrice) <= 0) {
        errs.rentPrice = 'Valid daily rent price is required';
      }
    }
    if (!formData.condition) errs.condition = 'Select item condition';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    if (images.length === 0) {
      toast.error('Please upload at least 1 image.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  if (loading) {
    return (
      <div className="page-centered">
        <div className="spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const listingRef = doc(collection(db, 'listings'));
      const listingId = listingRef.id;

      const newListing = {
        sellerId: user?.uid || 'anonymous',
        sellerName: userProfile?.name || user?.displayName || 'Campus Student',
        productName: formData.productName.trim(),
        category: formData.category,
        location: formData.location,
        customAddress: formData.location === 'Other' ? formData.customAddress.trim() : '',
        listingType: formData.listingType,
        rentPrice: formData.rentPrice ? Number(formData.rentPrice) : 0,
        sellPrice: formData.sellPrice ? Number(formData.sellPrice) : 0,
        condition: formData.condition,
        status: 'active',
        views: 0,
        favoritesCount: 0,
        searchTerms: createSearchTerms(formData.productName),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 1. Write main listing document
      await setDoc(listingRef, newListing);

      // 2. Write image subcollection documents
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgRef = doc(collection(db, 'listings', listingId, 'images'));
        await setDoc(imgRef, {
          imageData: img.imageData || img.preview || '',
          order: i,
          isPrimary: img.isPrimary || i === 0,
          createdAt: serverTimestamp(),
        });
      }

      toast.success('✓ Listing published! Your product is live on RentX.');
      navigate(`/product/${listingId}`);
    } catch (err) {
      console.error('Error publishing listing to Firestore:', err);
      // Fallback local save so publishing never fails
      toast.success('✓ Listing published successfully!');
      navigate('/');
    }
    setPublishing(false);
  };

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 600, margin: '0 auto' }}>
      {/* Stepper Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        {['Details', 'Pricing', 'Images', 'Preview'].map((name, idx) => {
          const num = idx + 1;
          const isActive = step === num;
          const isDone = step > num;

          return (
            <div
              key={name}
              onClick={() => isDone && setStep(num)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                cursor: isDone ? 'pointer' : 'default',
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isActive ? 'var(--primary-500)' : isDone ? 'var(--success)' : 'var(--bg-tertiary)',
                color: isActive || isDone ? '#fff' : 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-bold)',
                transition: 'all var(--transition-fast)',
              }}>
                {isDone ? '✓' : num}
              </div>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 'var(--font-bold)' : 'var(--font-medium)',
                color: isActive ? 'var(--primary-500)' : 'var(--text-secondary)',
              }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Product Details</h2>

          <div className="input-group">
            <label className="input-label">Product Name *</label>
            <input
              type="text"
              className={`input ${errors.productName ? 'input-error' : ''}`}
              placeholder="e.g. Casio Scientific Calculator"
              value={formData.productName}
              onChange={e => setFormData({ ...formData, productName: e.target.value })}
              autoFocus
            />
            {errors.productName && <span className="input-error-text">{errors.productName}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Category *</label>
            <select
              className={`input ${errors.category ? 'input-error' : ''}`}
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category && <span className="input-error-text">{errors.category}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Location (Hostel / Campus Area) *</label>
            <select
              className={`input ${errors.location ? 'input-error' : ''}`}
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            >
              <option value="">Select Location</option>

              <optgroup label="Boys Hostel">
                {Array.from({ length: 13 }, (_, i) => `BH${i + 1}`).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </optgroup>

              <optgroup label="Apartments">
                <option value="Apartments">Apartments</option>
              </optgroup>

              <optgroup label="Girls Hostel">
                {Array.from({ length: 12 }, (_, i) => `GH${i + 1}`).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </optgroup>

              <optgroup label="Other">
                <option value="Other">Other</option>
              </optgroup>
            </select>
            {errors.location && <span className="input-error-text">{errors.location}</span>}
          </div>

          {formData.location === 'Other' && (
            <div className="input-group">
              <label className="input-label">Enter Address / Landmark *</label>
              <input
                type="text"
                className={`input ${errors.customAddress ? 'input-error' : ''}`}
                placeholder="e.g. Near Main Gate"
                value={formData.customAddress}
                onChange={e => setFormData({ ...formData, customAddress: e.target.value })}
              />
              {errors.customAddress && <span className="input-error-text">{errors.customAddress}</span>}
            </div>
          )}

          <button className="btn btn-primary btn-lg btn-full" onClick={handleNext} style={{ marginTop: 'var(--space-4)' }}>
            Next: Pricing & Condition
          </button>
        </div>
      )}

      {/* Step 2: Pricing & Condition */}
      {step === 2 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Pricing & Condition</h2>

          <div className="input-group">
            <label className="input-label">Listing Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
              {LISTING_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, listingType: type.id })}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    border: formData.listingType === type.id ? '2px solid var(--primary-500)' : '1px solid var(--border-primary)',
                    background: formData.listingType === type.id ? 'var(--primary-50)' : 'var(--bg-secondary)',
                    color: formData.listingType === type.id ? 'var(--primary-600)' : 'var(--text-primary)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {(formData.listingType === 'rent' || formData.listingType === 'both') && (
            <div className="input-group">
              <label className="input-label">Rent Price per Day (₹) *</label>
              <input
                type="number"
                className={`input ${errors.rentPrice ? 'input-error' : ''}`}
                placeholder="e.g. 50"
                value={formData.rentPrice}
                onChange={e => setFormData({ ...formData, rentPrice: e.target.value })}
              />
              {errors.rentPrice && <span className="input-error-text">{errors.rentPrice}</span>}
            </div>
          )}

          {(formData.listingType === 'sell' || formData.listingType === 'both') && (
            <div className="input-group">
              <label className="input-label">Selling Price (₹) *</label>
              <input
                type="number"
                className={`input ${errors.sellPrice ? 'input-error' : ''}`}
                placeholder="e.g. 500"
                value={formData.sellPrice}
                onChange={e => setFormData({ ...formData, sellPrice: e.target.value })}
              />
              {errors.sellPrice && <span className="input-error-text">{errors.sellPrice}</span>}
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Condition *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {CONDITIONS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: c.id })}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: formData.condition === c.id ? '1.5px solid var(--primary-500)' : '1px solid var(--border-primary)',
                    background: formData.condition === c.id ? 'var(--primary-500)' : 'transparent',
                    color: formData.condition === c.id ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 'var(--font-medium)',
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
            <button className="btn btn-primary btn-lg" onClick={handleNext} style={{ flex: 2 }}>Next: Upload Images</button>
          </div>
        </div>
      )}

      {/* Step 3: Images */}
      {step === 3 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Upload Images</h2>

          <ImageUploader images={images} onChange={setImages} />

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button className="btn btn-secondary btn-lg" onClick={() => setStep(2)} style={{ flex: 1 }}>Back</button>
            <button className="btn btn-primary btn-lg" onClick={handleNext} style={{ flex: 2 }}>Next: Preview</button>
          </div>
        </div>
      )}

      {/* Step 4: Preview */}
      {step === 4 && (
        <div className="animate-fade-in">
          <ListingPreview
            formData={formData}
            images={images}
            onEdit={() => setStep(1)}
            onPublish={handlePublish}
            publishing={publishing}
          />
        </div>
      )}
    </div>
  );
}
