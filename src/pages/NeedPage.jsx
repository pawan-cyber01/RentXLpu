import { Link } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, PackageCheck } from 'lucide-react';

export default function NeedPage() {
  return (
    <div className="page-content" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - var(--header-height) - var(--bottom-nav-height) - 40px)',
      padding: 'var(--space-4)',
    }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 520,
          textAlign: 'center',
          padding: 'var(--space-8) var(--space-6)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border-primary)',
          background: 'var(--bg-tertiary)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        {/* Animated Glowing Icon Badge */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fbc02d, #f57f17)',
          color: '#101010',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(251, 192, 45, 0.45)',
        }}>
          <Sparkles size={36} strokeWidth={2.5} />
        </div>

        {/* Banner Tag */}
        <div className="badge badge-warning" style={{
          fontSize: '12px',
          fontWeight: 'var(--font-extrabold)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}>
          🚀 Launching Soon
        </div>

        {/* Coming Soon Title */}
        <div>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-extrabold)',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2
          }}>
            Need Section Coming Soon!
          </h1>
          <p className="text-secondary text-sm" style={{ marginTop: 'var(--space-2)', lineHeight: 1.5, maxWidth: 420 }}>
            We are building a dedicated campus request hub where LPU hostelers can post specific item requirements and fulfill fellow students' needs.
          </p>
        </div>

        {/* Feature Teasers */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          width: '100%',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-secondary)',
          textAlign: 'left',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PackageCheck size={16} color="var(--primary-500)" />
            <span>Post specific requests for books, calculators & hostel gear</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} color="var(--primary-500)" />
            <span>Instant notifications when matching items are listed nearby</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/buy"
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            borderRadius: 'var(--radius-xl)',
            fontWeight: 'var(--font-bold)',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <span>Explore Marketplace</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
