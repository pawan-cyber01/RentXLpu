import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import SearchBar from '../components/marketplace/SearchBar';
import CategoryChips from '../components/marketplace/CategoryChips';
import ProductCard from '../components/marketplace/ProductCard';
import FilterSheet from '../components/marketplace/FilterSheet';
import SortSheet from '../components/marketplace/SortSheet';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { useListings } from '../hooks/useListings';
import { useDebounce } from '../hooks/useDebounce';

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters] = useState({});

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { listings, loading, loadingMore, hasMore, totalResults, loadMore } = useListings({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    location: filters.location || undefined,
    condition: filters.condition || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    sortBy,
    searchTerms: debouncedSearch ? [debouncedSearch] : undefined,
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all' && v !== 0).length;

  return (
    <div className="page-content">
      <div className="marketplace-header" style={{ paddingTop: 'calc(var(--space-10) + 12px)' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search all products..."
          autoFocus={!!initialQuery}
        />
        <button className="btn btn-icon btn-secondary" onClick={() => setShowFilters(true)} aria-label="Filters" style={{ position: 'relative' }}>
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--primary-500)', color: '#fff',
              fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'var(--font-bold)',
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>
        <button className="btn btn-icon btn-secondary" onClick={() => setShowSort(true)} aria-label="Sort">
          <ArrowUpDown size={18} />
        </button>
      </div>

      <div style={{ paddingBottom: 'var(--space-2)' }}>
        <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {!loading && (
        <p className="result-count">
          {debouncedSearch ? (
            <>{totalResults} result{totalResults !== 1 ? 's' : ''} for "{debouncedSearch}"</>
          ) : (
            <>{totalResults} product{totalResults !== 1 ? 's' : ''}</>
          )}
        </p>
      )}

      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : listings.length > 0 ? (
        <>
          <div className="product-grid">
            {listings.map(listing => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
          {hasMore && (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              <button className="btn btn-secondary" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? <span className="spinner" /> : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="search"
          title="No products found"
          message="Try changing your search or filters."
        />
      )}

      <FilterSheet isOpen={showFilters} onClose={() => setShowFilters(false)} filters={filters} onApply={setFilters} />
      <SortSheet isOpen={showSort} onClose={() => setShowSort(false)} selected={sortBy} onSelect={setSortBy} />
    </div>
  );
}
