/**
 * Format price with Indian Rupee symbol
 */
export function formatPrice(price) {
  if (!price && price !== 0) return '';
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

/**
 * Format rent price with /day suffix
 */
export function formatRentPrice(price) {
  if (!price && price !== 0) return '';
  return `₹${Number(price).toLocaleString('en-IN')}/day`;
}

/**
 * Get relative time string from a timestamp
 */
export function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const past = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return past.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Mask phone number: +91 98****1234
 */
export function maskPhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;
  const last4 = digits.slice(-4);
  const first2 = digits.length > 10 ? digits.slice(-10, -8) : digits.slice(0, 2);
  return `+91 ${first2}****${last4}`;
}

/**
 * Generate a unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get condition label from ID
 */
export function getConditionLabel(id) {
  const map = {
    'new': 'New',
    'like-new': 'Like New',
    'good': 'Good',
    'fair': 'Fair',
    'used': 'Used',
  };
  return map[id] || id;
}

/**
 * Get listing type label
 */
export function getListingTypeLabel(type) {
  const map = {
    'sell': 'For Sale',
    'rent': 'For Rent',
    'both': 'Sale & Rent',
  };
  return map[type] || type;
}

/**
 * Debounce utility (non-hook version)
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Create search terms array for Firestore text search
 */
export function createSearchTerms(text) {
  if (!text) return [];
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const terms = new Set();
  words.forEach(word => {
    for (let i = 1; i <= word.length; i++) {
      terms.add(word.substring(0, i));
    }
    terms.add(word);
  });
  return Array.from(terms);
}

/**
 * Human-readable Firebase error messages
 */
export function getFirebaseErrorMessage(code) {
  const messages = {
    'auth/invalid-phone-number': 'Please enter a valid phone number.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/code-expired': 'The OTP has expired. Please request a new one.',
    'auth/invalid-verification-code': 'Invalid OTP. Please check and try again.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
    'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
    'auth/missing-phone-number': 'Please enter your phone number.',
    'permission-denied': 'You don\'t have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
  };
  return messages[code] || 'Something went wrong. Please try again.';
}
