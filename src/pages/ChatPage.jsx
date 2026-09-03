import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConversations, getOrCreateChat } from '../hooks/useChat';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function ChatPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const listingId = searchParams.get('listingId');
  const sellerId = searchParams.get('sellerId');

  const [activeChatId, setActiveChatId] = useState(null);
  const { conversations, loading: chatLoading } = useConversations(user?.uid);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    // If query params are passed from ProductPage, auto-initialize/open chat
    if (listingId && sellerId && user?.uid) {
      getOrCreateChat({
        buyerId: user.uid,
        sellerId,
        listingId,
      }).then(id => {
        if (id) setActiveChatId(id);
      }).catch(err => {
        console.warn('Chat initialization notice:', err);
      });
    }
  }, [listingId, sellerId, user?.uid]);

  if (authLoading) {
    return (
      <div className="page-centered">
        <div className="spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (activeChatId) {
    return (
      <ChatWindow
        chatId={activeChatId}
        onBack={() => {
          setActiveChatId(null);
          // Clear query params
          navigate('/chat', { replace: true });
        }}
      />
    );
  }

  return (
    <div className="page-content" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ padding: 'var(--space-4) var(--space-4) 0' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Messages</h1>
        <p className="text-sm text-secondary">Direct chats with buyers & sellers</p>
      </div>

      {chatLoading ? (
        <LoadingSkeleton type="list" count={4} />
      ) : (
        <ChatList
          conversations={conversations}
          onSelectChat={setActiveChatId}
        />
      )}
    </div>
  );
}
