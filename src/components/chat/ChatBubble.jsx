import { Shield } from 'lucide-react';
import { timeAgo } from '../../lib/utils';

export default function ChatBubble({ message, isOwn, isMine }) {
  const isOwnMessage = isOwn ?? isMine ?? false;
  const isAdminMsg = message.isAdmin || message.senderId === 'ADMIN' || message.senderName === 'Admin';
  const time = message.createdAt?.toDate
    ? timeAgo(message.createdAt.toDate())
    : (message.createdAt ? timeAgo(new Date(message.createdAt)) : 'Just now');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
      margin: 'var(--space-2) 0',
      width: '100%',
    }}>
      {/* Admin header label if message comes from admin */}
      {isAdminMsg && !isOwnMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 4,
          fontSize: '11px',
          fontWeight: 'var(--font-bold)',
          color: 'var(--primary-400)',
          paddingLeft: 4,
        }}>
          <Shield size={12} color="var(--primary-400)" />
          <span>RentX Admin</span>
        </div>
      )}

      <div style={{
        maxWidth: '80%',
        padding: '0.65rem 1rem',
        borderRadius: isOwnMessage ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
        background: isOwnMessage
          ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))'
          : isAdminMsg
          ? 'linear-gradient(135deg, #1e1b4b, #2d1b69)'
          : 'var(--bg-tertiary)',
        color: isOwnMessage || isAdminMsg ? '#ffffff' : 'var(--text-primary)',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.4,
        boxShadow: isOwnMessage
          ? '0 2px 8px rgba(124, 58, 237, 0.25)'
          : isAdminMsg
          ? '0 2px 10px rgba(139, 92, 246, 0.3)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: isAdminMsg && !isOwnMessage ? '1px solid rgba(168, 85, 247, 0.4)' : 'none',
        wordBreak: 'break-word',
      }}>
        {message.text}
      </div>
      <span style={{
        fontSize: '10px',
        color: 'var(--text-tertiary)',
        marginTop: 2,
        padding: '0 4px',
      }}>
        {time}
      </span>
    </div>
  );
}

