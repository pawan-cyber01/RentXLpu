import { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight, ShoppingBag, Tag, User, Shield } from 'lucide-react';
import { timeAgo } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import EmptyState from '../ui/EmptyState';
import logo from '../../assets/logo.svg';

export default function ChatList({ conversations = [], onSelectChat }) {
  const { user } = useAuth();
  const [bifurcationTab, setBifurcationTab] = useState('all'); // all | buying | selling
  const [chatExtraDetails, setChatExtraDetails] = useState({});

  const currentUserId = user?.uid;

  // Enrich conversations with real names and product image logos if missing
  useEffect(() => {
    const enrichChats = async () => {
      const extraMap = {};
      for (const chat of conversations) {
        let isBuyer = currentUserId === chat.buyerId;
        let otherUserId = isBuyer ? chat.sellerId : chat.buyerId;
        let otherName = isBuyer ? chat.sellerName : chat.buyerName;
        let photo = isBuyer ? chat.sellerPhoto : chat.buyerPhoto;
        let productImg = chat.listingImage || '';

        // 1. Resolve real name if missing or generic (only for seller viewing buyer)
        if (!otherName || otherName.includes('Student') || otherName.includes('Lister') || otherName === 'Buyer' || otherName === 'Seller') {
          try {
            if (otherUserId && otherUserId !== 'ADMIN') {
              const uSnap = await getDoc(doc(db, 'users', otherUserId));
              if (uSnap.exists() && uSnap.data().name) {
                otherName = uSnap.data().name;
                photo = uSnap.data().profilePhoto || photo;
              }
            }
          } catch (e) {}
        }

        // 2. Resolve product image logo if missing
        if (!productImg && chat.listingId) {
          try {
            const imgSnap = await getDocs(collection(db, 'listings', chat.listingId, 'images'));
            if (!imgSnap.empty) {
              productImg = imgSnap.docs[0].data().imageData || imgSnap.docs[0].data().preview || '';
            }
          } catch (e) {}
        }

        extraMap[chat.id] = {
          realOtherName: otherName || (isBuyer ? 'Seller' : 'Student / Buyer'),
          photo: photo || '',
          productImg: productImg || '',
        };
      }
      setChatExtraDetails(extraMap);
    };

    if (conversations.length > 0) {
      enrichChats();
    }
  }, [conversations, currentUserId]);

  // Filter conversations by bifurcation tab
  const filteredConversations = conversations.filter(chat => {
    if (bifurcationTab === 'buying') {
      return chat.buyerId === currentUserId;
    }
    if (bifurcationTab === 'selling') {
      return chat.sellerId === currentUserId;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
      {/* Bifurcation Control Bar (All | Buying | Selling) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: 4,
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button
          className={`btn btn-sm ${bifurcationTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setBifurcationTab('all')}
          style={{ flex: 1, borderRadius: 'var(--radius-lg)', fontSize: '12px', fontWeight: 'var(--font-bold)' }}
        >
          All ({conversations.length})
        </button>
        <button
          className={`btn btn-sm ${bifurcationTab === 'buying' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setBifurcationTab('buying')}
          style={{ flex: 1, borderRadius: 'var(--radius-lg)', fontSize: '12px', fontWeight: 'var(--font-bold)' }}
        >
          🛒 Buying
        </button>
        <button
          className={`btn btn-sm ${bifurcationTab === 'selling' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setBifurcationTab('selling')}
          style={{ flex: 1, borderRadius: 'var(--radius-lg)', fontSize: '12px', fontWeight: 'var(--font-bold)' }}
        >
          🏷️ Selling
        </button>
      </div>

      {/* Conversation List */}
      {filteredConversations.length === 0 ? (
        <EmptyState
          icon="package"
          title={bifurcationTab === 'buying' ? 'No buying inquiries' : bifurcationTab === 'selling' ? 'No selling inquiries' : 'No messages yet'}
          message={
            bifurcationTab === 'buying'
              ? 'Inquiries you send to sellers will appear here.'
              : bifurcationTab === 'selling'
              ? 'Messages from students interested in your listings will appear here.'
              : 'When you initiate a chat with a lister, your conversations will appear here.'
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filteredConversations.map(chat => {
            const time = chat.lastMessageAt?.toDate ? timeAgo(chat.lastMessageAt.toDate()) : 'Recently';
            const isIUserBuyer = currentUserId === chat.buyerId;
            const isAdminChat = chat.isAdminChat || chat.sellerId === 'ADMIN' || chat.buyerId === 'ADMIN';

            const extra = chatExtraDetails[chat.id] || {};
            // Privacy rule: If user is buyer -> hide seller name and show "Seller". If Admin -> "Admin".
            const displayOtherName = isAdminChat
              ? 'Admin'
              : isIUserBuyer
              ? 'Seller'
              : (extra.realOtherName || chat.buyerName || 'Buyer');

            const productImg = extra.productImg || chat.listingImage || '';
            const profilePhoto = isIUserBuyer ? '' : (extra.photo || '');
            const initial = displayOtherName.charAt(0).toUpperCase();

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-2xl)',
                  border: isAdminChat ? '1px solid var(--primary-500)' : '1px solid var(--border-secondary)',
                  transition: 'all var(--transition-base)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
                  {/* PRODUCT IMAGE LOGO / ADMIN SHIELD / USER AVATAR */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    background: isAdminChat ? 'linear-gradient(135deg, #7c3aed, #4c1d95)' : 'var(--bg-tertiary)',
                    border: isAdminChat ? '2px solid var(--warning)' : '2px solid var(--primary-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    position: 'relative'
                  }}>
                    {isAdminChat ? (
                      <Shield size={24} color="#ffffff" />
                    ) : productImg ? (
                      <img src={productImg} alt={chat.listingName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : profilePhoto ? (
                      <img src={profilePhoto} alt={displayOtherName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: isIUserBuyer ? 'linear-gradient(135deg, #fbc02d, #f57f17)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: isIUserBuyer ? '#101010' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'var(--font-extrabold)',
                        fontSize: 'var(--text-lg)'
                      }}>
                        {initial}
                      </div>
                    )}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    {/* Display Name + Role Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', margin: 0, color: 'var(--text-primary)' }}>
                        {displayOtherName}
                      </h4>
                      {isAdminChat ? (
                        <span className="badge badge-warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                          🛡️ Admin
                        </span>
                      ) : (
                        <span className={`badge ${isIUserBuyer ? 'badge-warning' : 'badge-primary'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {isIUserBuyer ? '🛒 Buying' : '🏷️ Selling'}
                        </span>
                      )}
                    </div>

                    {/* Product Name Subtitle */}
                    <div style={{ fontSize: '11px', color: 'var(--primary-400)', fontWeight: 'var(--font-semibold)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShoppingBag size={12} /> {chat.listingName || 'Marketplace Item'}
                    </div>

                    {/* Last Message Snippet */}
                    <p className="text-xs text-secondary truncate" style={{ marginTop: 2, margin: 0 }}>
                      {chat.lastMessage || 'Tap to open conversation'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginLeft: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{time}</span>
                  <ChevronRight size={16} color="var(--text-tertiary)" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

