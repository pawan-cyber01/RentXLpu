import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Plus, Users, MessageCircle, MapPin, Tag, X, Sparkles, Send } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../lib/constants';

const DEMO_COMMUNITY_NEEDS = [
  {
    id: 'demo_1',
    userName: 'Rahul Sharma',
    userHostel: 'BH-3, Room 412',
    productName: 'Scientific Calculator (Fx-991EX)',
    category: 'Electronics',
    budget: '₹200 / week',
    description: 'Urgently needed for end-term exams next week. Will handle with care!',
    createdAt: '2 mins ago',
  },
  {
    id: 'demo_2',
    userName: 'Ananya Verma',
    userHostel: 'GH-2, Block B',
    productName: 'Induction Cooktop & Pan',
    category: 'Hostel Essentials',
    budget: '₹400 / month',
    description: 'Looking to rent an induction cooktop for late night study sessions.',
    createdAt: '15 mins ago',
  },
  {
    id: 'demo_3',
    userName: 'Vikram Singh',
    userHostel: 'BH-1, Room 108',
    productName: 'Gear Bicycle for Campus',
    category: 'Hostel Essentials',
    budget: '₹1,200 to Buy',
    description: 'Want a second-hand cycle in good running condition.',
    createdAt: '1 hour ago',
  },
];

export default function NeedPage() {
  const { user, userProfile, isAuthenticated } = useAuth();
  const toast = useToast();

  const [needs, setNeeds] = useState(DEMO_COMMUNITY_NEEDS);
  const [loading, setLoading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    category: 'Electronics',
    location: 'BH-3 (Boys Hostel)',
    budget: '',
    description: '',
  });

  // Fetch community needs from Firestore
  useEffect(() => {
    const fetchCommunityNeeds = async () => {
      try {
        const snap = await getDocs(collection(db, 'needs'));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setNeeds(prev => [...list, ...DEMO_COMMUNITY_NEEDS]);
        }
      } catch (err) {
        console.warn('Using community demo needs feed:', err);
      }
    };
    fetchCommunityNeeds();
  }, []);

  const handleSubmitNeed = async (e) => {
    e.preventDefault();
    if (!formData.productName.trim()) {
      toast.error('Please enter what item you need.');
      return;
    }

    setSubmitting(true);

    const newNeed = {
      id: 'need_' + Date.now(),
      userName: userProfile?.name || user?.displayName || 'Campus Student',
      userHostel: formData.location,
      productName: formData.productName.trim(),
      category: formData.category,
      budget: formData.budget ? `₹${formData.budget}` : 'Flexible',
      description: formData.description.trim(),
      createdAt: 'Just now',
    };

    try {
      await addDoc(collection(db, 'needs'), {
        ...newNeed,
        userId: user?.uid || 'anon',
        status: 'active',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Saved need to community feed locally:', err);
    }

    setNeeds(prev => [newNeed, ...prev]);
    toast.success('✓ Need posted to Campus Community!');
    setShowPostModal(false);
    setFormData({
      productName: '',
      category: 'Electronics',
      location: 'BH-3 (Boys Hostel)',
      budget: '',
      description: '',
    });
    setSubmitting(false);
  };

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', maxWidth: 680, margin: '0 auto' }}>
      {/* Community Header with Top + Post Need Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-6)',
        padding: 'var(--space-4)',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 'var(--radius-2xl)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Users size={22} color="var(--primary-500)" />
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-extrabold)', margin: 0 }}>
              Campus Need Community
            </h1>
          </div>
          <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-1)' }}>
            Post requirements & fulfill fellow students' needs
          </p>
        </div>

        {/* TOP + POST NEED BUTTON */}
        <button
          className="btn btn-primary"
          onClick={() => setShowPostModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '0.55rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 'var(--font-bold)',
            fontSize: 'var(--text-sm)',
            boxShadow: '0 6px 18px rgba(251, 192, 45, 0.4)'
          }}
        >
          <Plus size={18} strokeWidth={3} />
          <span>Post Need</span>
        </button>
      </div>

      {/* Community Feed Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {needs.map(need => (
          <div
            key={need.id}
            className="glass-card"
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}
          >
            {/* Poster Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbc02d, #f57f17)',
                  color: '#101010',
                  fontWeight: 'var(--font-bold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-md)',
                  boxShadow: '0 4px 12px rgba(251, 192, 45, 0.3)'
                }}>
                  {need.userName ? need.userName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>
                    {need.userName}
                  </div>
                  <div className="text-xs text-secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} color="var(--primary-500)" />
                    {need.userHostel || 'Campus Hostel'}
                  </div>
                </div>
              </div>

              <span className="badge badge-warning" style={{ fontSize: '11px', fontWeight: 'var(--font-bold)' }}>
                {need.budget || 'Flexible'}
              </span>
            </div>

            {/* Need Content */}
            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', color: 'var(--primary-400)', marginBottom: 4 }}>
                Looking for: {need.productName}
              </h3>
              {need.description && (
                <p className="text-sm text-secondary" style={{ margin: 0, lineHeight: 1.4 }}>
                  {need.description}
                </p>
              )}
            </div>

            {/* Footer Action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 'var(--space-2)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <span className="text-xs text-secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Tag size={12} /> {need.category}
              </span>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => toast.info(`Connecting with ${need.userName}...`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px'
                }}
              >
                <MessageCircle size={14} color="var(--primary-500)" />
                <span>Offer Item / Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POST NEED MODAL */}
      {showPostModal && (
        <div className="overlay" style={{ zIndex: 1000 }}>
          <div className="modal glass-card card-body" style={{ width: '90%', maxWidth: 480, position: 'relative' }}>
            <button
              className="btn-icon btn-ghost"
              onClick={() => setShowPostModal(false)}
              style={{ position: 'absolute', top: 12, right: 12 }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
              <Sparkles size={22} color="var(--primary-500)" />
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                Post a Campus Need
              </h2>
            </div>

            <form onSubmit={handleSubmitNeed} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label className="input-label">What item do you need? *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Scientific Calculator, Cycle, Induction"
                  value={formData.productName}
                  onChange={e => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Hostel / Location</label>
                <select
                  className="input"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Estimated Budget / Offering (Optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 200/day or Buy for 1000"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Description / Details</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Mention duration needed or special preferences..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPostModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Posting...' : 'Post to Feed'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
