import { Package, Search, Heart, ShoppingBag } from 'lucide-react';

const ICONS = {
  package: Package,
  search: Search,
  heart: Heart,
  shopping: ShoppingBag,
};

export default function EmptyState({ icon = 'package', title, message, action }) {
  const IconComponent = ICONS[icon] || Package;

  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">
        <IconComponent size={36} />
      </div>
      <h3 className="empty-state-title">{title || 'Nothing here yet'}</h3>
      <p className="empty-state-text">{message || 'Be the first to list something.'}</p>
      {action && action}
    </div>
  );
}
