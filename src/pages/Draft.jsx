import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '../context/useData';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Draft() {
  const { saveDraft } = useData();
  const [appType, setAppType] = useState(() => {
    try {
      return sessionStorage.getItem('ircc-type') || 'Visitor visa';
    } catch {
      return 'Visitor visa';
    }
  });
  const [purpose, setPurpose] = useState(() => {
    try {
      return sessionStorage.getItem('ircc-purpose') || 'Tourism';
    } catch {
      return 'Tourism';
    }
  });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDraft();
    sessionStorage.setItem('ircc-type', appType);
    sessionStorage.setItem('ircc-purpose', purpose);
    setFeedback('Draft saved successfully.');
  };

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>Application details</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <p>
              Complete the application form below. All fields are required unless marked otherwise.
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <form onSubmit={handleSubmit} class="form-horizontal">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">Applicant information</h3>
                </div>
                <div class="panel-body">
                  <div class="form-group">
                    <label for="type" class="col-sm-4 control-label">Application type</label>
                    <div class="col-sm-8">
                      <select
                        id="type"
                        class="form-control"
                        value={appType}
                        onChange={(e) => setAppType(e.target.value)}
                      >
                        <option>Visitor visa</option>
                        <option>Study permit</option>
                        <option>Work permit</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="purpose" class="col-sm-4 control-label">Purpose of visit</label>
                    <div class="col-sm-8">
                      <select
                        id="purpose"
                        class="form-control"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      >
                        <option>Tourism</option>
                        <option>Study</option>
                        <option>Work</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {feedback && (
                <div class="alert alert-success" role="alert">
                  {feedback}
                </div>
              )}

              <button type="submit" class="btn btn-primary">Save draft</button>
              <Link to="/dashboard" class="btn btn-default">Back to account</Link>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
