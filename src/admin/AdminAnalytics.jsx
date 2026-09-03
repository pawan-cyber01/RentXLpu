import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminAnalytics() {
  const barData = {
    labels: ['Electronics', 'Books', 'Furniture', 'Hostel Essentials', 'Gaming', 'Cycles'],
    datasets: [
      {
        label: 'Active Listings by Category',
        data: [28, 18, 14, 22, 12, 9],
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ['For Sale', 'For Rent', 'Both'],
    datasets: [
      {
        label: 'Listing Type Ratio',
        data: [45, 30, 25],
        backgroundColor: ['#7c3aed', '#3b82f6', '#22c55e'],
      },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)' }}>Marketplace Analytics</h1>
        <p className="text-sm text-secondary">Visual breakdowns of campus activity, listing categories, and transaction types</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="glass-card card-body">
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>Category Breakdown</h3>
          <Bar data={barData} />
        </div>

        <div className="glass-card card-body">
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)' }}>Listing Type Distribution</h3>
          <div style={{ maxWidth: 300, margin: '0 auto' }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
