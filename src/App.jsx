import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AppLayout from './components/layout/AppLayout';

// Phase 1 Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BuyPage from './pages/BuyPage';
import RentPage from './pages/RentPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Phase 2 Pages
import ListPage from './pages/ListPage';
import ProductPage from './pages/ProductPage';
import ChatPage from './pages/ChatPage';

// Phase 3 Pages
import NeedPage from './pages/NeedPage';
import MyListingsPage from './pages/MyListingsPage';
import EditListingPage from './pages/EditListingPage';
import FavoritesPage from './pages/FavoritesPage';
import RateSellerPage from './pages/RateSellerPage';
import PlatformReviewPage from './pages/PlatformReviewPage';

// Phase 4 Admin Components
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminListings from './admin/AdminListings';
import AdminReports from './admin/AdminReports';
import AdminAnnouncements from './admin/AdminAnnouncements';
import AdminCategories from './admin/AdminCategories';
import AdminLocations from './admin/AdminLocations';
import AdminReviews from './admin/AdminReviews';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminActivityLog from './admin/AdminActivityLog';
import AdminSettings from './admin/AdminSettings';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-centered">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-centered">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/buy" element={<BuyPage />} />
      <Route path="/rent" element={<RentPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/reviews" element={<PlatformReviewPage />} />

      {/* Protected Student Routes */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/list" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/need" element={<ProtectedRoute><NeedPage /></ProtectedRoute>} />
      <Route path="/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
      <Route path="/edit-listing/:id" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/rate-seller/:sellerId" element={<ProtectedRoute><RateSellerPage /></ProtectedRoute>} />
      <Route path="/rate-rentx" element={<ProtectedRoute><PlatformReviewPage /></ProtectedRoute>} />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/listings" element={<AdminRoute><AdminListings /></AdminRoute>} />
      <Route path="/admin/needs" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
      <Route path="/admin/locations" element={<AdminRoute><AdminLocations /></AdminRoute>} />
      <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="/admin/activity" element={<AdminRoute><AdminActivityLog /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
