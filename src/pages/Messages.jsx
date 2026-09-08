import { Link } from 'react-router-dom';
import { useData } from '../context/useData';

export function Messages() {
  const { application, messages, readMessages } = useData();
  const unreadCount = messages.filter((message) => !readMessages.has(message.id)).length;

  return (
    <main id="wb-cont" className="container portal-main">
      <header className="portal-page-header compact">
        <div>
          <p className="eyebrow">{application.type} · {application.number}</p>
          <h1>Messages</h1>
          <p>Read requests, confirmations, and decisions about your application.</p>
        </div>
        <span className="message-total">{unreadCount} unread</span>
      </header>

      <section className="portal-card message-list" aria-label="Application messages">
        {messages.map((message) => {
          const isUnread = !readMessages.has(message.id);
          return (
            <Link key={message.id} to={`/messages/${message.id}`} className={`message-row ${isUnread ? 'unread' : ''}`}>
              <span className="message-state" aria-hidden="true" />
              <span className="message-date">{message.date}</span>
              <span className="message-copy">
                <strong>{message.title}</strong>
                <small>{message.type} · {message.body}</small>
              </span>
              <span className={`status-pill ${isUnread ? 'status-action' : 'status-waiting'}`}>{isUnread ? 'Unread' : 'Read'}</span>
              <span className="message-arrow" aria-hidden="true">›</span>
            </Link>
          );
        })}
      </section>

      <p className="privacy-note">Messages in this demonstration are fictional. Official IRCC correspondence appears only in your real account.</p>
    </main>
  );
}
