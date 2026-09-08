import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';

export function Dashboard() {
  const { user } = useAuth();
  const { application, attached, messages, readMessages } = useData();
  const unread = messages.filter((message) => !readMessages.has(message.id));

  return (
    <main id="wb-cont" className="container portal-main">
      <header className="portal-page-header">
        <div>
          <p className="eyebrow">Account overview</p>
          <h1>Welcome back, {user?.name || 'Alex Morgan'}</h1>
          <p>Track your visitor visa application and complete any requests from IRCC.</p>
        </div>
        <div className="last-updated">
          <span>Last updated</span>
          <strong>{application.lastUpdated}</strong>
        </div>
      </header>

      {!attached && (
        <section className="action-banner" aria-labelledby="action-title">
          <div className="action-icon" aria-hidden="true">!</div>
          <div>
            <p className="eyebrow">Action required</p>
            <h2 id="action-title">Upload your updated proof of funds</h2>
            <p>We must receive the requested document by <strong>{application.nextActionDue}</strong>.</p>
          </div>
          <Link className="portal-button portal-button-primary" to="/documents">Review request</Link>
        </section>
      )}

      {attached && (
        <section className="success-banner" role="status">
          <strong>Document ready to submit.</strong> Review your upload in Documents.
          <Link to="/documents">View document</Link>
        </section>
      )}

      <div className="dashboard-grid">
        <section className="portal-card application-card" aria-labelledby="application-title">
          <div className="card-heading-row">
            <div>
              <p className="eyebrow">Active application</p>
              <h2 id="application-title">{application.type}</h2>
            </div>
            <span className="status-pill status-in-progress">{application.status}</span>
          </div>
          <dl className="application-facts">
            <div><dt>Application number</dt><dd>{application.number}</dd></div>
            <div><dt>Date submitted</dt><dd>{application.submitted}</dd></div>
            <div><dt>Purpose</dt><dd>{application.purpose}</dd></div>
            <div><dt>Current step</dt><dd>Eligibility review</dd></div>
          </dl>
          <div className="compact-progress" aria-label="2 of 6 application stages complete">
            <span style={{ width: '33%' }} />
          </div>
          <p className="progress-caption">2 of 6 stages complete</p>
          <Link className="portal-button portal-button-primary" to="/status">View detailed status</Link>
        </section>

        <aside className="portal-card next-steps-card" aria-labelledby="next-steps-title">
          <p className="eyebrow">What happens next</p>
          <h2 id="next-steps-title">Your next steps</h2>
          <ol className="next-steps-list">
            <li className="active"><span>1</span><div><strong>Upload requested document</strong><small>Due {application.nextActionDue}</small></div></li>
            <li><span>2</span><div><strong>Wait for our review</strong><small>We will message you if anything else is needed.</small></div></li>
            <li><span>3</span><div><strong>Receive a decision</strong><small>Passport instructions are sent only if approved.</small></div></li>
          </ol>
        </aside>
      </div>

      <section className="quick-links" aria-labelledby="quick-links-title">
        <div className="section-heading">
          <div><p className="eyebrow">Application tools</p><h2 id="quick-links-title">Manage your application</h2></div>
        </div>
        <div className="quick-link-grid">
          <Link to="/documents"><span className="quick-link-icon" aria-hidden="true">DOC</span><strong>Documents</strong><small>{attached ? '1 upload ready' : '1 document requested'}</small></Link>
          <Link to="/messages"><span className="quick-link-icon" aria-hidden="true">MSG</span><strong>Messages</strong><small>{unread.length} unread message{unread.length === 1 ? '' : 's'}</small></Link>
          <Link to="/profile"><span className="quick-link-icon" aria-hidden="true">ID</span><strong>Applicant profile</strong><small>Contact and account details</small></Link>
        </div>
      </section>
    </main>
  );
}
