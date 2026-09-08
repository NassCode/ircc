import { Link } from 'react-router-dom';
import { useData } from '../context/useData';

const stateLabels = {
  complete: 'Complete',
  current: 'In progress',
  waiting: 'Not started',
};

export function ApplicationStatus() {
  const { application, attached } = useData();

  return (
    <main id="wb-cont" className="container portal-main">
      <header className="portal-page-header compact">
        <div>
          <p className="eyebrow">{application.type} · {application.number}</p>
          <h1>Application status</h1>
          <p>Follow each stage from submission through a final decision.</p>
        </div>
        <span className="status-pill status-in-progress">{application.status}</span>
      </header>

      <section className="status-summary" aria-label="Application summary">
        <div><span>Submitted</span><strong>{application.submitted}</strong></div>
        <div><span>Last updated</span><strong>{application.lastUpdated}</strong></div>
        <div><span>Application number</span><strong>{application.number}</strong></div>
        <div><span>UCI</span><strong>{application.uci}</strong></div>
      </section>

      {!attached && (
        <section className="inline-alert" role="alert">
          <strong>Your application needs information.</strong>
          <span>Upload an updated proof of funds by {application.nextActionDue}.</span>
          <Link to="/documents">View request</Link>
        </section>
      )}

      <div className="status-layout">
        <section className="portal-card" aria-labelledby="timeline-title">
          <div className="section-heading">
            <div><p className="eyebrow">Processing journey</p><h2 id="timeline-title">Application timeline</h2></div>
            <span className="timeline-count">2 of 6 complete</span>
          </div>
          <ol className="visa-timeline">
            {application.stages.map((stage) => (
              <li key={stage.id} className={`timeline-${stage.state}`}>
                <span className="timeline-marker" aria-hidden="true">{stage.state === 'complete' ? '✓' : ''}</span>
                <div className="timeline-content">
                  <div className="timeline-heading">
                    <h3>{stage.label}</h3>
                    <span className={`status-pill status-${stage.state}`}>{stateLabels[stage.state]}</span>
                  </div>
                  <strong className="timeline-date">{stage.date}</strong>
                  <p>{stage.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside>
          <section className="portal-card info-card">
            <p className="eyebrow">About processing</p>
            <h2>What this status means</h2>
            <p>Your eligibility review is underway. Some stages may happen at the same time or change as the application is assessed.</p>
            <p>We cannot provide an exact completion date. Check your messages for requests or decisions.</p>
          </section>
          <section className="portal-card info-card">
            <h2>Need to update something?</h2>
            <p>Use the official IRCC web form for changes to your address, contact information, or circumstances.</p>
            <a href="https://www.canada.ca/en/immigration-refugees-citizenship/corporate/contact-ircc/web-form.html">Open the official web form</a>
          </section>
        </aside>
      </div>
    </main>
  );
}
