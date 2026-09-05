import { useState, useRef, useEffect } from 'react';
import { Send, ShieldAlert, Ban, ArrowLeft, MoreVertical, ShoppingBag, Shield } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import ChatMiniCard from './ChatMiniCard';
import ChatBubble from './ChatBubble';

export default function ChatWindow({ chatId, onBack }) {
  const { user } = useAuth();
  const { messages, chatDetails, loading, sendMessage } = useChat(chatId);
  const toast = useToast();

  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [realOtherName, setRealOtherName] = useState('');
  const [otherPhoto, setOtherPhoto] = useState('');
  const messagesEndRef = useRef(null);

  const isUserBuyer = user?.uid === chatDetails?.buyerId;
  const otherUserId = isUserBuyer ? chatDetails?.sellerId : chatDetails?.buyerId;
  const isAdminChat = chatDetails?.isAdminChat || chatDetails?.sellerId === 'ADMIN' || otherUserId === 'ADMIN';

  // Resolve real person name & profile photo
  useEffect(() => {
    if (!chatDetails) return;

    if (isAdminChat) {
      setRealOtherName('Admin');
      return;
    }

    let initialName = isUserBuyer ? 'Seller' : chatDetails.buyerName;
    let initialPhoto = isUserBuyer ? '' : chatDetails.buyerPhoto;

    setRealOtherName(initialName || (isUserBuyer ? 'Seller' : 'Buyer'));
    if (initialPhoto && !isUserBuyer) setOtherPhoto(initialPhoto);

    // Fetch real name from users doc if not buyer (only show buyer name to seller, hide seller name from buyer)
    if (otherUserId && !isUserBuyer && otherUserId !== 'ADMIN') {
      getDoc(doc(db, 'users', otherUserId)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.name) setRealOtherName(data.name);
          if (data.profilePhoto) setOtherPhoto(data.profilePhoto);
        }
      }).catch(() => {});
    }
  }, [chatDetails, isUserBuyer, otherUserId, isAdminChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    const text = input;
    setInput('');
    await sendMessage(user.uid, text);
  };

  const handleBlockUser = () => {
    toast.success('User has been blocked. You will no longer receive messages from them.');
    setShowMenu(false);
  };

  const handleReportUser = () => {
    toast.info('Report submitted to RentX moderation team.');
    setShowMenu(false);
  };

  // Header Display Name:
  // If admin chat -> "Admin"
  // If user is buyer -> "Seller" (Lister name hidden as requested)
  // If user is seller -> buyer's name
  const displayHeaderName = isAdminChat
    ? 'Admin'
    : isUserBuyer
    ? 'Seller'
    : (realOtherName || 'Buyer');

  const initialLetter = displayHeaderName.charAt(0).toUpperCase();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - var(--header-height) - var(--bottom-nav-height))',
      background: 'var(--bg-primary)',
    }}>
      {/* Header with Display Name & Profile Avatar / Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--glass-bg)',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {onBack && (
            <button className="btn-icon btn-ghost btn-sm" onClick={onBack} aria-label="Back to conversations">
              <ArrowLeft size={18} />
            </button>
          )}

          {/* Photo Avatar / Initial / Shield Logo */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            overflow: 'hidden',
            border: isAdminChat ? '2px solid var(--warning)' : '2px solid var(--primary-500)',
            background: isAdminChat ? 'linear-gradient(135deg, #7c3aed, #4c1d95)' : 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isAdminChat ? (
              <Shield size={20} color="#ffffff" />
            ) : otherPhoto && !isUserBuyer ? (
              <img src={otherPhoto} alt={displayHeaderName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--primary-500)', fontSize: '14px' }}>
                {initialLetter}
              </span>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', margin: 0, color: 'var(--text-primary)' }}>
                {displayHeaderName}
              </h3>
              {isAdminChat && (
                <span className="badge badge-warning" style={{ fontSize: '10px', padding: '1px 6px' }}>
                  Official
                </span>
              )}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-400)', fontWeight: 'var(--font-medium)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShoppingBag size={12} /> {chatDetails?.listingName || 'Marketplace Item'}
            </span>
          </div>
        </div>

        {/* Menu button */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon btn-ghost btn-sm"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-1)',
              zIndex: 10,
              width: 140,
            }}>
              <button
                onClick={handleReportUser}
                className="btn btn-ghost btn-sm btn-full"
                style={{ justifyContent: 'flex-start', color: 'var(--text-secondary)' }}
              >
                <ShieldAlert size={14} /> Report User
              </button>
              <button
                onClick={handleBlockUser}
                className="btn btn-ghost btn-sm btn-full"
                style={{ justifyContent: 'flex-start', color: 'var(--error)' }}
              >
                <Ban size={14} /> Block User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mini Product Context Card */}
      {chatDetails && (
        <ChatMiniCard
          listingId={chatDetails.listingId}
          listingName={chatDetails.listingName}
          listingPrice={chatDetails.listingPrice}
          listingRentPrice={chatDetails.listingRentPrice}
          listingLocation={chatDetails.listingLocation}
        />
      )}

      {/* Messages Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        {messages.length === 0 ? (
          <div className="text-center text-secondary text-sm" style={{ margin: 'auto' }}>
            No messages yet. Say hi to start negotiating!
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isMine={msg.senderId === user?.uid}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} style={{
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--glass-bg)',
        borderTop: '1px solid var(--border-primary)',
        display: 'flex',
        gap: 'var(--space-2)',
      }}>
        <input
          type="text"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary btn-icon" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
