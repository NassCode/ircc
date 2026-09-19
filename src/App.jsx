import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { useAuth } from './context/useAuth';
import { AccountLayout } from './components/AccountLayout';
import { AdminLayout } from './components/AdminLayout';
import { AdminApplicants } from './pages/AdminApplicants';
import { AdminCreateApplicant } from './pages/AdminCreateApplicant';
import { AdminApplicantEditor } from './pages/AdminApplicantEditor';
import { ApplicationStatus } from './pages/ApplicationStatus';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { Login } from './pages/Login';
import { MessageDetail } from './pages/MessageDetail';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { PublicPage } from './pages/PublicPage';

function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="container portal-main"><p>Checking your session…</p></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
}

function AppRoutes() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RoleRoute role="applicant"><AccountLayout /></RoleRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/status" element={<ApplicationStatus />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<MessageDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<RoleRoute role="admin"><AdminLayout /></RoleRoute>}>
          <Route path="/admin" element={<AdminApplicants />} />
          <Route path="/admin/users/new" element={<AdminCreateApplicant />} />
          <Route path="/admin/users/:id" element={<AdminApplicantEditor />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DataProvider>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>;
}
