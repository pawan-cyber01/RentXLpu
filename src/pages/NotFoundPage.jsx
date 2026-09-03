import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-centered">
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <div style={{
          fontSize: '6rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--font-extrabold)',
          background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: 'var(--space-4)',
        }}>
          404
        </div>
        <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>Page not found</h1>
        <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)', maxWidth: 280, margin: '0 auto var(--space-6)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
