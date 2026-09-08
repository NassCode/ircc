import { NavLink, Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';

const navigation = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/status', label: 'Application status' },
  { to: '/documents', label: 'Documents' },
  { to: '/messages', label: 'Messages' },
  { to: '/profile', label: 'Profile' },
];

export function AccountLayout() {
  const { logout } = useAuth();
  const { messages, readMessages } = useData();
  const unreadCount = messages.filter((message) => !readMessages.has(message.id)).length;

  return (
    <div className="account-page">
      <Header />
      <div className="demo-ribbon" role="note">
        <div className="container">
          <strong>Demo account</strong>
          <span>Fictional application data—this is not an IRCC service.</span>
        </div>
      </div>
      <div className="account-navigation">
        <div className="container account-navigation-inner">
          <NavLink className="account-wordmark" to="/dashboard">IRCC secure account</NavLink>
          <nav aria-label="Account navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => isActive ? 'active' : undefined}
              >
                {item.label}
                {item.to === '/messages' && unreadCount > 0 && (
                  <span className="nav-count" aria-label={`${unreadCount} unread`}>{unreadCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <button type="button" className="account-signout" onClick={logout}>Sign out</button>
        </div>
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}
