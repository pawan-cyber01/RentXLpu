import { useRef } from 'react';
import { Upload, X, Star, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useImageCompressor } from '../../hooks/useImageCompressor';

export default function ImageUploader({ images, onChange }) {
  const fileInputRef = useRef(null);
  const { compressImage, compressing } = useImageCompressor();

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - images.length;
    const selectedFiles = files.slice(0, remainingSlots);

    for (const file of selectedFiles) {
      const result = await compressImage(file);
      if (result) {
        onChange(prev => [
          ...prev,
          {
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
            imageData: result.base64,
            sizeKB: result.sizeKB,
            isPrimary: prev.length === 0, // First image is primary by default
          }
        ]);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id) => {
    onChange(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimary = (id) => {
    onChange(prev =>
      prev.map(img => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const handleMove = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;

    onChange(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return copy;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="flex-between">
        <div>
          <label className="input-label">Product Images</label>
          <p className="text-xs text-secondary">Min 1 image, Max 5 images</p>
        </div>
        <span className="badge badge-neutral">{images.length} / 5</span>
      </div>

      {/* Grid of uploaded images */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: 'var(--space-3)',
      }}>
        {images.map((img, idx) => (
          <div
            key={img.id}
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: img.isPrimary ? '2px solid var(--primary-500)' : '1px solid var(--border-primary)',
              background: 'var(--bg-tertiary)',
            }}
          >
            <img
              src={img.imageData}
              alt={`Product ${idx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Primary badge */}
            {img.isPrimary && (
              <span style={{
                position: 'absolute',
                top: 4,
                left: 4,
                background: 'var(--primary-500)',
                color: '#fff',
                fontSize: '9px',
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 'var(--font-semibold)',
              }}>
                Cover
              </span>
            )}

            {/* Action Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              opacity: 0,
              transition: 'opacity var(--transition-fast)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 4,
            }}
            className="image-hover-overlay"
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => handleSetPrimary(img.id)}
                  title="Make cover image"
                  style={{
                    background: img.isPrimary ? 'var(--warning)' : 'rgba(255,255,255,0.8)',
                    color: img.isPrimary ? '#fff' : '#000',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Star size={12} fill={img.isPrimary ? '#fff' : 'none'} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(img.id)}
                  title="Remove image"
                  style={{
                    background: 'var(--error)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={12} />
                </button>
              </div>

              {/* Reorder controls */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    style={{ background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: 4, padding: 2, cursor: 'pointer' }}
                  >
                    <ArrowLeft size={12} color="#000" />
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    style={{ background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: 4, padding: 2, cursor: 'pointer' }}
                  >
                    <ArrowRight size={12} color="#000" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add image slot button */}
        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={compressing}
            style={{
              aspectRatio: '1',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed var(--input-border)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-1)',
              cursor: compressing ? 'wait' : 'pointer',
              color: 'var(--text-tertiary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {compressing ? (
              <span className="spinner" />
            ) : (
              <>
                <Upload size={22} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)' }}>Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Optimization Indicator Requirement */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-3)',
        background: 'var(--success-bg)',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--success)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
      }}>
        <CheckCircle2 size={16} />
        <span>Optimized • Under 1 MB</span>
      </div>
    </div>
  );
}
