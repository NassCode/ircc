import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useData } from '../context/useData';

export function MessageDetail() {
  const { id } = useParams();
  const { application, messages, markRead } = useData();
  const message = messages.find((item) => item.id === id);

  useEffect(() => {
    if (message) markRead(message.id);
  }, [message, markRead]);

  if (!message) {
    return (
      <main id="wb-cont" className="container portal-main">
        <header className="portal-page-header compact"><div><h1>Message not found</h1><p>This message is not available.</p></div></header>
        <Link className="portal-button portal-button-secondary" to="/messages">Back to messages</Link>
      </main>
    );
  }

  return (
    <main id="wb-cont" className="container portal-main narrow-main">
      <Link className="back-link" to="/messages">← Back to messages</Link>
      <article className="portal-card correspondence">
        <header>
          <span className="status-pill status-waiting">{message.type}</span>
          <h1>{message.title}</h1>
          <dl>
            <div><dt>Date</dt><dd>{message.date}</dd></div>
            <div><dt>Application</dt><dd>{application.number}</dd></div>
          </dl>
        </header>
        <div className="correspondence-body">
          <p>Dear {`Alex Morgan`},</p>
          <p>{message.body}</p>
          {message.id === 'documents' && (
            <>
              <h2>What you need to do</h2>
              <ol>
                <li>Prepare a clear copy of a recent bank statement.</li>
                <li>Make sure the document is in English or French, or includes a certified translation.</li>
                <li>Upload it through the Documents page by {application.nextActionDue}.</li>
              </ol>
              <p>If you do not provide the document by the deadline, a decision may be made using the information already on file.</p>
            </>
          )}
          <p>Immigration, Refugees and Citizenship Canada</p>
          <p className="privacy-note">This is fictional correspondence created for the local demonstration.</p>
        </div>
        <footer>
          <Link className="portal-button portal-button-primary" to={`/${message.action}`}>
            {message.action === 'documents' ? 'Open document request' : 'View application status'}
          </Link>
        </footer>
      </article>
    </main>
  );
}
