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
import { useSeo } from '../hooks/useSeo';

export default function BuyPage() {
  useSeo({
    title: 'Buy Products in LPU — Secondhand Books, Electronics & Hostel Gear',
    description: 'Browse products for sale by Lovely Professional University (LPU) students in BH1, BH3, GH1 hostels.',
  });

  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters] = useState({});

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { listings, loading, loadingMore, hasMore, totalResults, loadMore } = useListings({
    type: 'sell',
    category: selectedCategory !== 'all' ? selectedCategory : filters.category !== 'all' ? filters.category : undefined,
    location: filters.location || undefined,
    condition: filters.condition || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    sortBy,
    searchTerms: debouncedSearch ? [debouncedSearch] : undefined,
  });

  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
  }, [searchParams]);

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all' && v !== 0).length;

  return (
    <div className="page-content" style={{ paddingTop: 'var(--space-2)' }}>
      {/* Search + Action Buttons */}
      <div className="marketplace-header" style={{ paddingTop: 0 }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for sale..."
        />
        <button
          className="btn btn-icon btn-secondary"
          onClick={() => setShowFilters(true)}
          aria-label="Filters"
          style={{ position: 'relative' }}
        >
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

      {/* Category Chips */}
      <div style={{ paddingBottom: 'var(--space-2)' }}>
        <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="filter-chips" style={{ paddingBottom: 'var(--space-2)' }}>
          {filters.location && (
            <span className="filter-chip">
              📍 {filters.location}
              <button className="filter-chip-remove" onClick={() => setFilters(f => ({ ...f, location: '' }))}>×</button>
            </span>
          )}
          {filters.condition && (
            <span className="filter-chip">
              {filters.condition}
              <button className="filter-chip-remove" onClick={() => setFilters(f => ({ ...f, condition: '' }))}>×</button>
            </span>
          )}
          {(filters.minPrice > 0 || (filters.maxPrice > 0 && filters.maxPrice < 50000)) && (
            <span className="filter-chip">
              ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '50k+'}
              <button className="filter-chip-remove" onClick={() => setFilters(f => ({ ...f, minPrice: 0, maxPrice: 50000 }))}>×</button>
            </span>
          )}
        </div>
      )}

      {/* Result count */}
      {!loading && (
        <p className="result-count">
          {debouncedSearch ? (
            <>{totalResults} result{totalResults !== 1 ? 's' : ''} for "{debouncedSearch}"</>
          ) : (
            <>{totalResults} product{totalResults !== 1 ? 's' : ''} for sale</>
          )}
        </p>
      )}

      {/* Product Grid */}
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
              <button
                className="btn btn-secondary"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? <span className="spinner" /> : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="search"
          title="No products found"
          message={debouncedSearch ? 'Try changing your search or filters.' : 'No products available for sale yet.'}
        />
      )}

      {/* Filter & Sort Sheets */}
      <FilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
      />
      <SortSheet
        isOpen={showSort}
        onClose={() => setShowSort(false)}
        selected={sortBy}
        onSelect={setSortBy}
      />
    </div>
  );
}
