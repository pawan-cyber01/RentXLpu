export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
  { id: 'books', name: 'Books', icon: 'BookOpen' },
  { id: 'furniture', name: 'Furniture', icon: 'Armchair' },
  { id: 'hostel-essentials', name: 'Hostel Essentials', icon: 'Backpack' },
  { id: 'clothing', name: 'Clothing', icon: 'Shirt' },
  { id: 'shoes', name: 'Shoes', icon: 'Footprints' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2' },
  { id: 'cycles', name: 'Cycles', icon: 'Bike' },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell' },
  { id: 'accessories', name: 'Accessories', icon: 'Watch' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal' },
];

export const LOCATIONS = [
  {
    group: 'Boys Hostel',
    items: [
      'BH1', 'BH2', 'BH3', 'BH4', 'BH5', 'BH6', 'BH7',
      'BH8', 'BH9', 'BH10', 'BH11', 'BH12', 'BH13',
    ],
  },
  {
    group: 'Apartments',
    items: ['Apartments'],
  },
  {
    group: 'Girls Hostel',
    items: [
      'GH1', 'GH2', 'GH3', 'GH4', 'GH5', 'GH6',
      'GH7', 'GH8', 'GH9', 'GH10', 'GH11', 'GH12',
    ],
  },
  {
    group: 'Other',
    items: ['Other'],
  },
];

export const ALL_LOCATIONS = LOCATIONS.flatMap(g => g.items);

export const CONDITIONS = [
  { id: 'new', label: 'New' },
  { id: 'like-new', label: 'Like New' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
  { id: 'used', label: 'Used' },
];

export const LISTING_TYPES = [
  { id: 'sell', label: 'Sell' },
  { id: 'rent', label: 'Rent' },
  { id: 'both', label: 'Both' },
];

export const LISTING_STATUSES = [
  { id: 'active', label: 'Active', color: '#22c55e' },
  { id: 'paused', label: 'Paused', color: '#f59e0b' },
  { id: 'reserved', label: 'Reserved', color: '#3b82f6' },
  { id: 'rented', label: 'Rented', color: '#8b5cf6' },
  { id: 'sold', label: 'Sold', color: '#64748b' },
  { id: 'removed', label: 'Removed', color: '#ef4444' },
];

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'price-low', label: 'Price: Low → High' },
  { id: 'price-high', label: 'Price: High → Low' },
  { id: 'most-viewed', label: 'Most Viewed' },
];

export const REPORT_REASONS = [
  'Scam',
  'Fake Product',
  'Spam',
  'Harassment',
  'Wrong Information',
  'Inappropriate Content',
  'Other',
];

export const CONDITION_COLORS = {
  'new': '#22c55e',
  'like-new': '#3b82f6',
  'good': '#8b5cf6',
  'fair': '#f59e0b',
  'used': '#64748b',
};
