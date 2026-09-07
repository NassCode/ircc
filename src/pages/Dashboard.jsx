import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { messages, readMessages } = useData();

  const unread = messages.filter((m) => !readMessages.has(m.id));

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>IRCC secure account</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <p>
              Welcome, {user?.name || 'Alex Morgan'}.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <h2>Your applications</h2>
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Work permit application</h3>
              </div>
              <div class="panel-body">
                <p>Application number: W000001-2026</p>
                <p>Status: In progress</p>
                <Link to="/status" class="btn btn-primary">View application</Link>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <h2>Messages</h2>
            {unread.length > 0 ? (
              <div class="panel panel-warning">
                <div class="panel-heading">
                  <h3 class="panel-title">You have {unread.length} unread message{unread.length > 1 ? 's' : ''}</h3>
                </div>
                <div class="panel-body">
                  <Link to="/messages" class="btn btn-primary">View messages</Link>
                </div>
              </div>
            ) : (
              <p>You have no new messages.</p>
            )}
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <h2>Account settings</h2>
            <Link to="/profile" class="btn btn-default">View profile</Link>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <button onClick={logout} class="btn btn-default">Sign out</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
