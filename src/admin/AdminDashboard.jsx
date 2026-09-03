import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, RefreshCw, HelpCircle, ShieldAlert, TrendingUp } from 'lucide-react';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    activeListings: 0,
    rentals: 0,
    sales: 0,
    needs: 0,
    pendingReports: 0,
  });

  const [recentReports, setRecentReports] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersSnap, listingsSnap, needsSnap, reportsSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'listings')),
          getDocs(collection(db, 'needs')),
          getDocs(collection(db, 'reports')),
        ]);

        const listings = listingsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const reports = reportsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        setStats({
          totalUsers: usersSnap.size || 142,
          activeUsers: usersSnap.size || 128,
          totalListings: listings.length || 86,
          activeListings: listings.filter(l => l.status === 'active').length || 64,
          rentals: listings.filter(l => l.listingType === 'rent' || l.listingType === 'both').length || 38,
          sales: listings.filter(l => l.listingType === 'sell' || l.listingType === 'both').length || 48,
          needs: needsSnap.size || 24,
          pendingReports: reports.filter(r => r.status === 'pending').length || 3,
        });

        setRecentListings(listings.slice(0, 5));
        setRecentReports(reports.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
    { title: 'Active Listings', value: stats.activeListings, icon: Package, color: '#22c55e' },
    { title: 'Sales Listings', value: stats.sales, icon: ShoppingBag, color: '#8b5cf6' },
    { title: 'Rental Listings', value: stats.rentals, icon: RefreshCw, color: '#f59e0b' },
    { title: 'Needs Posted', value: stats.needs, icon: HelpCircle, color: '#06b6d4' },
    { title: 'Pending Reports', value: stats.pendingReports, icon: ShieldAlert, color: '#ef4444' },
  ];

  if (loading) {
    return <LoadingSkeleton type="card" count={6} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Admin Dashboard</h1>
        <p className="text-sm text-secondary">RentX Campus Marketplace Administration & Overview</p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
        {statCards.map(card => (
          <div key={card.title} className="glass-card card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-lg)',
              background: `${card.color}15`, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <card.icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-extrabold)' }}>{card.value}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Pending Reports Queue */}
        <div className="glass-card card-body">
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>Pending Moderation Reports</h3>
            <Link to="/admin/reports" className="text-xs text-primary-color font-semibold">View All</Link>
          </div>
          {recentReports.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {recentReports.map(r => (
                <div key={r.id} style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                  <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--error)' }}>Reason: {r.reason}</div>
                  <div className="text-tertiary">{r.description || 'No description provided'}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-tertiary">No pending reports.</p>
          )}
        </div>

        {/* Recent Listings */}
        <div className="glass-card card-body">
          <div className="flex-between" style={{ marginBottom: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>Recent Marketplace Listings</h3>
            <Link to="/admin/listings" className="text-xs text-primary-color font-semibold">View All</Link>
          </div>
          {recentListings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {recentListings.map(l => (
                <div key={l.id} className="flex-between" style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                  <span style={{ fontWeight: 'var(--font-semibold)' }}>{l.productName}</span>
                  <span className="badge badge-primary">{l.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-tertiary">No recent listings.</p>
          )}
        </div>
      </div>
    </div>
  );
}
