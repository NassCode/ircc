import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const authenticatedUser = await login(username, password);
      navigate(authenticatedUser.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'The local sign-in service is unavailable. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>Sign in to your IRCC secure account</span>
            </h1>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <p>
              Enter your GCKey username and password to sign in to your IRCC secure account.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit} className="form-horizontal">
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <div className="form-group">
                <label htmlFor="username" className="col-sm-4 control-label">Username</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="col-sm-4 control-label">Password</label>
                <div className="col-sm-8">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-4 col-sm-8">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Signing in…' : 'Sign in'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h2>Need help?</h2>
            <p>
              <a href="/en/immigration-refugees-citizenship/services/application/account.html#help">Get help with your account</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
