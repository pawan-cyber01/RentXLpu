import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Megaphone, Sparkles } from 'lucide-react';

const DEFAULT_ANNOUNCEMENTS = [
  '📢 Welcome to RentX — LPU Hostel Marketplace! Buy, Rent & Need items directly with fellow students.',
  '⚡ Save big on hostel room essentials, books, electronics & cycle rentals!',
  '🎓 Verify your student account & start listing items for free today.',
];

export default function AnnouncementMarquee() {
  const [announcements, setAnnouncements] = useState(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const snap = await getDocs(collection(db, 'announcements'));
        if (!snap.empty) {
          const list = snap.docs.map(d => d.data().message || d.data().title).filter(Boolean);
          if (list.length > 0) setAnnouncements(list);
        }
      } catch (err) {
        console.warn('Using default announcements marquee notice:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  const marqueeText = announcements.join('   •   ');

  return (
    <div className="announcement-marquee-bar">
      <div className="announcement-marquee-content">
        <Megaphone size={14} className="marquee-icon" />
        <div className="marquee-track">
          <span className="marquee-text">{marqueeText} &nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp; {marqueeText}</span>
        </div>
        <Sparkles size={14} className="marquee-icon" />
      </div>
    </div>
  );
}
