import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function ApplicationStatus() {
  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>Application status</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <p>
              View the status of your immigration, citizenship, permanent residence, study permit, or work permit application.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">Work permit application</h3>
              </div>
              <div class="panel-body">
                <p>Application number: W000001-2026</p>
                <p>Status: In progress</p>
                <p>Last updated: September 5, 2026</p>
                <Link to="/documents" class="btn btn-primary">Upload documents</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
