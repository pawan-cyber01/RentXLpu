import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, where, orderBy, limit,
  getDocs, doc, getDoc, updateDoc, increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const PAGE_SIZE = 12;

/**
 * Hook for fetching and paginating marketplace listings
 * (Client-side filtered to avoid requiring Firestore composite indexes)
 */
export function useListings({ type, category, location, condition, minPrice, maxPrice, sortBy, searchTerms } = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    let snapshot;
    try {
      snapshot = await getDocs(collection(db, 'listings'));
    } catch (err) {
      console.error('Error fetching listings from Firestore:', err);
      setListings([]);
      setLoading(false);
      return;
    }

    try {
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter active status
      results = results.filter(l => l.status !== 'removed' && l.status !== 'deleted');

      // Filter type (sell | rent)
      if (type === 'sell') {
        results = results.filter(l => l.listingType === 'sell' || l.listingType === 'both');
      } else if (type === 'rent') {
        results = results.filter(l => l.listingType === 'rent' || l.listingType === 'both');
      }

      // Filter category
      if (category && category !== 'all') {
        results = results.filter(l => l.category === category);
      }

      // Filter location
      if (location) {
        results = results.filter(l => l.location === location);
      }

      // Filter condition
      if (condition) {
        results = results.filter(l => l.condition === condition);
      }

      // Filter price
      if (minPrice !== undefined && minPrice > 0) {
        results = results.filter(l => (l.sellPrice || l.rentPrice || 0) >= minPrice);
      }
      if (maxPrice !== undefined && maxPrice > 0) {
        results = results.filter(l => (l.sellPrice || l.rentPrice || 0) <= maxPrice);
      }

      // Client-side search filter
      if (searchTerms && searchTerms.length > 0) {
        const term = searchTerms[0].toLowerCase();
        results = results.filter(l => {
          const name = (l.productName || '').toLowerCase();
          const cat = (l.category || '').toLowerCase();
          return name.includes(term) || cat.includes(term);
        });
      }

      // Client-side sort
      results.sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.sellPrice || a.rentPrice || 0) - (b.sellPrice || b.rentPrice || 0);
        }
        if (sortBy === 'price-high') {
          return (b.sellPrice || b.rentPrice || 0) - (a.sellPrice || a.rentPrice || 0);
        }
        if (sortBy === 'most-viewed') {
          return (b.views || 0) - (a.views || 0);
        }
        if (sortBy === 'oldest') {
          const tA = a.createdAt?.seconds || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const tB = b.createdAt?.seconds || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return tA - tB;
        }
        // default newest
        const tA = a.createdAt?.seconds || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tB = b.createdAt?.seconds || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tB - tA;
      });

      setListings(results);
      setTotalResults(results.length);
    } catch (error) {
      console.error('Error processing listings:', error);
    }
    setLoading(false);
  }, [type, category, location, condition, sortBy, minPrice, maxPrice, searchTerms]);

  useEffect(() => {
    fetchListings();
  }, [type, category, location, condition, sortBy, minPrice, maxPrice, searchTerms]);

  return {
    listings,
    loading,
    loadingMore: false,
    hasMore: false,
    totalResults,
    loadMore: () => {},
    refresh: fetchListings,
  };
}

/**
 * Fetch a single listing by ID
 */
export function useListing(listingId) {
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'listings', listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });

          // Increment view count
          updateDoc(docRef, { views: increment(1) }).catch(() => {});

          // Fetch images from subcollection
          try {
            const imagesSnap = await getDocs(collection(db, 'listings', listingId, 'images'));
            const imageList = imagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            imageList.sort((a, b) => (a.order || 0) - (b.order || 0));
            setImages(imageList);
          } catch (imgErr) {
            console.warn('Subcollection image fetch notice:', imgErr);
          }
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
      setLoading(false);
    };

    fetchListing();
  }, [listingId]);

  return { listing, images, loading };
}

/**
 * Fetch user listings for /my-listings page
 */
export function useMyListings(userId, statusFilter = 'all') {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let snapshot;
        try {
          const q = query(collection(db, 'listings'), where('sellerId', '==', userId));
          snapshot = await getDocs(q);
        } catch (err) {
          console.warn('Fallback fetching all listings for my-listings filter:', err);
          snapshot = await getDocs(collection(db, 'listings'));
        }

        let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // Client-side filter by userId
        results = results.filter(l => l.sellerId === userId);

        // Client-side filter by status
        if (statusFilter && statusFilter !== 'all') {
          results = results.filter(l => l.status === statusFilter);
        } else {
          results = results.filter(l => l.status !== 'removed' && l.status !== 'deleted');
        }

        // Client-side sort desc
        results.sort((a, b) => {
          const tA = a.createdAt?.seconds || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const tB = b.createdAt?.seconds || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return tB - tA;
        });

        setListings(results);
      } catch (error) {
        console.error('Error fetching my listings:', error);
        setListings([]);
      }
      setLoading(false);
    };

    fetchMyListings();
  }, [userId, statusFilter]);

  return { listings, loading };
}
