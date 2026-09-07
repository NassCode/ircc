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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
      return;
    }
    setError('The username or password is incorrect.');
  };

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>Sign in to your IRCC secure account</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <p>
              Enter your GCKey username and password to sign in to your IRCC secure account.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <form onSubmit={handleSubmit} class="form-horizontal">
              {error && <div class="alert alert-danger" role="alert">{error}</div>}
              <div class="form-group">
                <label for="username" class="col-sm-4 control-label">Username</label>
                <div class="col-sm-8">
                  <input
                    type="text"
                    id="username"
                    class="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="password" class="col-sm-4 control-label">Password</label>
                <div class="col-sm-8">
                  <input
                    type="password"
                    id="password"
                    class="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-offset-4 col-sm-8">
                  <button type="submit" class="btn btn-primary">Sign in</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
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
