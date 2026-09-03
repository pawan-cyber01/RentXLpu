import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { CATEGORIES, LOCATIONS, CONDITIONS, LISTING_TYPES } from '../lib/constants';
import ImageUploader from '../components/listing/ImageUploader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function EditListingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    location: '',
    customAddress: '',
    listingType: 'both',
    sellPrice: '',
    rentPrice: '',
    condition: 'good',
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const snap = await getDoc(doc(db, 'listings', id));
        if (snap.exists()) {
          const data = snap.data();

          // Authorization check: owner only
          if (data.sellerId !== user?.uid) {
            toast.error('You are not authorized to edit this listing.');
            navigate('/my-listings');
            return;
          }

          setFormData({
            productName: data.productName || '',
            category: data.category || '',
            location: data.location || '',
            customAddress: data.customAddress || '',
            listingType: data.listingType || 'both',
            sellPrice: data.sellPrice || '',
            rentPrice: data.rentPrice || '',
            condition: data.condition || 'good',
          });

          // Fetch images subcollection
          const imgSnap = await getDocs(collection(db, 'listings', id, 'images'));
          setImages(imgSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error('Error loading listing:', err);
      }
      setLoading(false);
    };
    fetchListing();
  }, [id, user?.uid, navigate, toast]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Update main listing document
      await updateDoc(doc(db, 'listings', id), {
        productName: formData.productName.trim(),
        category: formData.category,
        location: formData.location,
        customAddress: formData.location === 'Other' ? formData.customAddress.trim() : '',
        listingType: formData.listingType,
        rentPrice: formData.rentPrice ? Number(formData.rentPrice) : 0,
        sellPrice: formData.sellPrice ? Number(formData.sellPrice) : 0,
        condition: formData.condition,
        updatedAt: serverTimestamp(),
      });

      // 2. Overwrite images subcollection
      const existingImgs = await getDocs(collection(db, 'listings', id, 'images'));
      for (const d of existingImgs.docs) {
        await deleteDoc(d.ref);
      }

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await setDoc(doc(collection(db, 'listings', id, 'images')), {
          imageData: img.imageData,
          order: i,
          isPrimary: img.isPrimary,
          createdAt: serverTimestamp(),
        });
      }

      toast.success('✓ Listing updated successfully.');
      navigate('/my-listings');
    } catch (err) {
      console.error('Error updating listing:', err);
      toast.error('Failed to update listing.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="page-content" style={{ padding: 'var(--space-4)' }}>
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>
        Edit Listing
      </h1>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="input-group">
          <label className="input-label">Product Name</label>
          <input
            type="text"
            className="input"
            value={formData.productName}
            onChange={e => setFormData({ ...formData, productName: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Category</label>
          <select
            className="input"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Location</label>
          <select
            className="input"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            required
          >
            {LOCATIONS.flatMap(g => g.items).map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {formData.location === 'Other' && (
          <div className="input-group">
            <label className="input-label">Custom Address</label>
            <input
              type="text"
              className="input"
              value={formData.customAddress}
              onChange={e => setFormData({ ...formData, customAddress: e.target.value })}
            />
          </div>
        )}

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
            <label className="input-label">Rent Price per Day (₹)</label>
            <input
              type="number"
              className="input"
              value={formData.rentPrice}
              onChange={e => setFormData({ ...formData, rentPrice: e.target.value })}
            />
          </div>
        )}

        {(formData.listingType === 'sell' || formData.listingType === 'both') && (
          <div className="input-group">
            <label className="input-label">Selling Price (₹)</label>
            <input
              type="number"
              className="input"
              value={formData.sellPrice}
              onChange={e => setFormData({ ...formData, sellPrice: e.target.value })}
            />
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Condition</label>
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

        <ImageUploader images={images} onChange={setImages} />

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/my-listings')} style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ flex: 2 }}>
            {saving ? <span className="spinner" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
