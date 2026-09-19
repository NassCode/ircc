import { NavLink, Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { useAuth } from '../context/useAuth';

export function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div className="account-page admin-page">
      <Header />
      <div className="account-navigation"><div className="container account-navigation-inner">
        <NavLink className="account-wordmark" to="/admin">IRCC control panel</NavLink>
        <nav aria-label="Administration navigation"><NavLink to="/admin" end>Applicants</NavLink><NavLink to="/admin/users/new">Create applicant</NavLink></nav>
        <button type="button" className="account-signout" onClick={logout}>Sign out</button>
      </div></div>
      <Outlet />
      <Footer />
    </div>
  );
}
