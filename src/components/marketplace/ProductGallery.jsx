import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images = [], productName = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="flex-center" style={{
        aspectRatio: '4/3',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-xl)',
        fontSize: 'var(--text-4xl)',
      }}>
        📦
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Main Active Image Display */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        background: 'var(--bg-tertiary)',
      }}>
        <img
          src={currentImage.imageData}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Carousel Prev/Next Overlay Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
              style={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--glass-bg-strong)',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--glass-bg-strong)',
                border: '1px solid var(--glass-border)',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', padding: '4px 0' }}>
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: selectedIndex === idx ? '2px solid var(--primary-500)' : '1px solid var(--border-primary)',
                padding: 0,
                background: 'var(--bg-tertiary)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <img
                src={img.imageData}
                alt={`Thumbnail ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
