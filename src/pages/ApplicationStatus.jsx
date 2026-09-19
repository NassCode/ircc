import { Link } from 'react-router-dom';
import { formatDate } from '../api';
import { useData } from '../context/useData';

const stateLabels = { complete: 'Complete', current: 'In progress', waiting: 'Not started' };
export function ApplicationStatus() {
  const { application } = useData();
  const completed = application.stages.filter((stage) => stage.state === 'complete').length;
  const outstanding = application.documentRequests.filter((request) => !request.upload).sort((a, b) => a.dueAt.localeCompare(b.dueAt))[0];
  return <main id="wb-cont" className="container portal-main">
    <header className="portal-page-header compact"><div><p className="eyebrow">{application.type} · {application.number}</p><h1>Application status</h1><p>Follow each published stage through a final decision.</p></div><span className="status-pill status-current">{application.status}</span></header>
    <section className="status-summary" aria-label="Application summary"><div><span>Submitted</span><strong>{formatDate(application.submittedAt)}</strong></div><div><span>Last updated</span><strong>{formatDate(application.lastUpdatedAt)}</strong></div><div><span>Application number</span><strong>{application.number}</strong></div><div><span>UCI</span><strong>{application.uci || 'Not provided'}</strong></div></section>
    {outstanding && <section className="inline-alert" role="alert"><strong>Your application needs information.</strong><span>{outstanding.title}{outstanding.dueAt ? ` is due ${formatDate(outstanding.dueAt)}.` : '.'}</span><Link to="/documents">View request</Link></section>}
    <div className="status-layout"><section className="portal-card"><div className="section-heading"><div><p className="eyebrow">Processing journey</p><h2>Application timeline</h2></div><span className="timeline-count">{completed} of {application.stages.length} complete</span></div>
      {application.stages.length ? <ol className="visa-timeline">{application.stages.map((stage) => <li key={stage.id} className={`timeline-${stage.state}`}><span className="timeline-marker" aria-hidden="true">{stage.state === 'complete' ? '✓' : ''}</span><div className="timeline-content"><div className="timeline-heading"><h3>{stage.label}</h3><span className={`status-pill status-${stage.state}`}>{stateLabels[stage.state]}</span></div><strong className="timeline-date">{stage.date || 'No date provided'}</strong><p>{stage.detail}</p></div></li>)}</ol> : <p>No timeline stages have been published for this application.</p>}
    </section><aside><section className="portal-card info-card"><p className="eyebrow">About processing</p><h2>What this status means</h2><p>Stages may happen at the same time or change as the application is assessed. Check your messages for requests or decisions.</p></section></aside></div>
  </main>;
}
