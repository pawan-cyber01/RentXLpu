import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

// Pages where we hide the main navigation
const HIDE_NAV_PAGES = ['/login'];

export default function AppLayout({ children }) {
  const location = useLocation();
  const hideNav = HIDE_NAV_PAGES.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  if (hideNav || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="page">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
