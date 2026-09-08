import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { DataProvider } from './context/DataContext';
import { PublicPage } from './pages/PublicPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ApplicationStatus } from './pages/ApplicationStatus';
import { Documents } from './pages/Documents';
import { Draft } from './pages/Draft';
import { Messages } from './pages/Messages';
import { MessageDetail } from './pages/MessageDetail';
import { Profile } from './pages/Profile';
import { AccountLayout } from './components/AccountLayout';

function ProtectedRoute({ children }) {
  const { signedIn } = useAuth();
  if (!signedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/status" element={<ApplicationStatus />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/draft" element={<Draft />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:id" element={<MessageDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
