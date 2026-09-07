import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Profile() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>Account profile</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Personal information</h3>
              </div>
              <div class="panel-body">
                <p><strong>Name:</strong> {user?.name || 'Alex Morgan'}</p>
                <p><strong>Username:</strong> {user?.username || 'alex.morgan'}</p>
                <p><strong>Email:</strong> alex.morgan@example.com</p>
                <p><strong>Preferred language:</strong> English</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <Link to="/dashboard" class="btn btn-default">Back to account</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
