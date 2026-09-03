import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, Clock, Sparkles } from 'lucide-react';
import SearchBar from '../components/marketplace/SearchBar';
import CategoryChips from '../components/marketplace/CategoryChips';
import ProductCard from '../components/marketplace/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { useListings } from '../hooks/useListings';
import { useAuth } from '../contexts/AuthContext';
import { useDebounce } from '../hooks/useDebounce';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { listings: featured, loading: loadingFeatured } = useListings({
    sortBy: 'most-viewed',
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    searchTerms: debouncedSearch ? [debouncedSearch] : undefined,
  });

  const { listings: recent, loading: loadingRecent } = useListings({
    sortBy: 'newest',
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="page-content" style={{ paddingTop: 'var(--space-2)' }}>
      {/* Categories */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <h2 className="section-title">Categories</h2>
        </div>
        <CategoryChips
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </section>

      {/* Featured / Recommended */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Sparkles size={20} color="var(--primary-500)" />
              Recommended
            </span>
          </h2>
          <Link to="/buy" className="section-action">
            View all <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </div>

        {loadingFeatured ? (
          <LoadingSkeleton type="card" count={4} />
        ) : featured.length > 0 ? (
          <div className="product-grid">
            {featured.slice(0, 8).map(listing => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="package"
            title="Nothing here yet"
            message="Be the first to list something."
            action={
              <Link to={isAuthenticated ? '/list' : '/login'} className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
                List a Product
              </Link>
            }
          />
        )}
      </section>

      {/* Recently Added */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Clock size={20} color="var(--text-secondary)" />
              Recently Added
            </span>
          </h2>
          <Link to="/buy?sort=newest" className="section-action">
            View all <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </div>

        {loadingRecent ? (
          <LoadingSkeleton type="card" count={4} />
        ) : recent.length > 0 ? (
          <div className="product-grid">
            {recent.slice(0, 6).map(listing => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : null}
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section style={{
          margin: 'var(--space-4)',
          padding: 'var(--space-8) var(--space-6)',
          background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
          borderRadius: 'var(--radius-2xl)',
          textAlign: 'center',
          color: '#ffffff',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
            Join RentX Today
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', opacity: 0.85, marginBottom: 'var(--space-6)', maxWidth: 300, margin: '0 auto var(--space-6)' }}>
            Buy, rent, sell, or list products with students on your campus.
          </p>
          <Link
            to="/login"
            className="btn btn-lg"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </section>
      )}
    </div>
  );
}
