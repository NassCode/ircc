import { Link } from 'react-router-dom';
import { formatDate } from '../api';
import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';

export function Dashboard() {
  const { user } = useAuth();
  const { application, messages } = useData();
  const unread = messages.filter((message) => !message.readAt).length;
  const outstanding = application.documentRequests.filter((request) => !request.upload).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const nextRequest = outstanding[0];
  const completed = application.stages.filter((stage) => stage.state === 'complete').length;
  const current = application.stages.find((stage) => stage.state === 'current');
  const progress = application.stages.length ? Math.round((completed / application.stages.length) * 100) : 0;
  return <main id="wb-cont" className="container portal-main">
    <header className="portal-page-header"><div><p className="eyebrow">Account overview</p><h1>Welcome back, {user.name}</h1><p>Track your {application.type.toLowerCase()} application and complete requests.</p></div><div className="last-updated"><span>Last updated</span><strong>{formatDate(application.lastUpdatedAt)}</strong></div></header>
    {nextRequest && <section className="action-banner" aria-labelledby="action-title"><div className="action-icon" aria-hidden="true">!</div><div><p className="eyebrow">Action required</p><h2 id="action-title">{nextRequest.title}</h2><p>{nextRequest.dueAt ? <>We must receive this by <strong>{formatDate(nextRequest.dueAt)}</strong>.</> : 'Review the document request.'}</p></div><Link className="portal-button portal-button-primary" to="/documents">Review request</Link></section>}
    <div className="dashboard-grid"><section className="portal-card application-card" aria-labelledby="application-title"><div className="card-heading-row"><div><p className="eyebrow">Active application</p><h2 id="application-title">{application.type}</h2></div><span className="status-pill status-current">{application.status}</span></div>
      <dl className="application-facts"><div><dt>Application number</dt><dd>{application.number}</dd></div><div><dt>Date submitted</dt><dd>{formatDate(application.submittedAt)}</dd></div><div><dt>Purpose</dt><dd>{application.purpose || 'Not provided'}</dd></div><div><dt>Current step</dt><dd>{current?.label || 'No current stage'}</dd></div></dl>
      <div className="compact-progress" aria-label={`${completed} of ${application.stages.length} application stages complete`}><span style={{ width: `${progress}%` }} /></div><p className="progress-caption">{completed} of {application.stages.length} stages complete</p><Link className="portal-button portal-button-primary" to="/status">View detailed status</Link>
    </section><aside className="portal-card next-steps-card"><p className="eyebrow">What happens next</p><h2>Your next steps</h2>{application.stages.length ? <ol className="next-steps-list">{application.stages.filter((stage) => stage.state !== 'complete').slice(0, 3).map((stage, index) => <li className={index === 0 ? 'active' : ''} key={stage.id}><span>{index + 1}</span><div><strong>{stage.label}</strong><small>{stage.date || stage.detail}</small></div></li>)}</ol> : <p>No timeline stages have been published.</p>}</aside></div>
    <section className="quick-links"><div className="section-heading"><div><p className="eyebrow">Application tools</p><h2>Manage your application</h2></div></div><div className="quick-link-grid"><Link to="/documents"><span className="quick-link-icon">DOC</span><strong>Documents</strong><small>{outstanding.length} outstanding request{outstanding.length === 1 ? '' : 's'}</small></Link><Link to="/messages"><span className="quick-link-icon">MSG</span><strong>Messages</strong><small>{unread} unread message{unread === 1 ? '' : 's'}</small></Link><Link to="/profile"><span className="quick-link-icon">ID</span><strong>Applicant profile</strong><small>Contact and account details</small></Link></div></section>
  </main>;
}
