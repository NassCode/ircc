import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatDate } from '../api';
import { useData } from '../context/useData';

export function MessageDetail() {
  const { id } = useParams();
  const { applicant, application, messages, markRead } = useData();
  const message = messages.find((item) => item.id === id);
  useEffect(() => { if (message && !message.readAt) markRead(message.id).catch(() => {}); }, [message, markRead]);
  if (!message) return <main id="wb-cont" className="container portal-main"><h1>Message not found</h1><p>This message is not available.</p><Link to="/messages">Back to messages</Link></main>;
  const actionPath = message.action === 'documents' ? '/documents' : message.action === 'status' ? '/status' : null;
  return <main id="wb-cont" className="container portal-main narrow-main"><Link className="back-link" to="/messages">← Back to messages</Link><article className="portal-card correspondence"><header><span className="status-pill status-waiting">{message.type}</span><h1>{message.title}</h1><dl><div><dt>Date</dt><dd>{formatDate(message.sentAt)}</dd></div><div><dt>Application</dt><dd>{application.number}</dd></div></dl></header><div className="correspondence-body"><p>Dear {applicant.profile.fullName},</p>{message.body.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}<p>Immigration, Refugees and Citizenship Canada</p><p className="privacy-note">This is fictional correspondence created for the local demonstration.</p></div>{actionPath && <footer><Link className="portal-button portal-button-primary" to={actionPath}>{message.action === 'documents' ? 'Open documents' : 'View application status'}</Link></footer>}</article></main>;
}
