import { timeAgo } from '../../lib/utils';

export default function ChatBubble({ message, isOwn }) {
  const time = message.createdAt?.toDate ? timeAgo(message.createdAt.toDate()) : 'Just now';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isOwn ? 'flex-end' : 'flex-start',
      margin: 'var(--space-2) 0',
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '0.65rem 1rem',
        borderRadius: isOwn ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
        background: isOwn ? 'linear-gradient(135deg, var(--primary-500), var(--primary-600))' : 'var(--bg-tertiary)',
        color: isOwn ? '#ffffff' : 'var(--text-primary)',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.4,
        boxShadow: isOwn ? '0 2px 8px rgba(124, 58, 237, 0.2)' : 'none',
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
