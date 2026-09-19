import { Link } from 'react-router-dom';
import { formatDate } from '../api';
import { useData } from '../context/useData';

export function Messages() {
  const { application, messages } = useData();
  const unreadCount = messages.filter((message) => !message.readAt).length;
  return <main id="wb-cont" className="container portal-main"><header className="portal-page-header compact"><div><p className="eyebrow">{application.type} · {application.number}</p><h1>Messages</h1><p>Read requests, confirmations, and decisions about your application.</p></div><span className="message-total">{unreadCount} unread</span></header>
    {messages.length ? <section className="portal-card message-list" aria-label="Application messages">{messages.map((message) => { const isUnread = !message.readAt; return <Link key={message.id} to={`/messages/${message.id}`} className={`message-row ${isUnread ? 'unread' : ''}`}><span className="message-state" aria-hidden="true" /><span className="message-date">{formatDate(message.sentAt)}</span><span className="message-copy"><strong>{message.title}</strong><small>{message.type} · {message.body}</small></span><span className={`status-pill ${isUnread ? 'status-action' : 'status-waiting'}`}>{isUnread ? 'Unread' : 'Read'}</span><span className="message-arrow">›</span></Link>; })}</section> : <section className="portal-card empty-state"><h2>No messages</h2><p>Messages about this application will appear here.</p></section>}
  </main>;
}
