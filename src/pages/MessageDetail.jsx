import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useData } from '../context/useData';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function MessageDetail() {
  const { id } = useParams();
  const { messages, markRead } = useData();

  const message = messages.find((m) => m.id === id);

  useEffect(() => {
    if (message) markRead(message.id);
  }, [message, markRead]);

  if (!message) {
    return (
      <>
        <Header />
        <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
          <div class="row">
            <div class="col-md-12">
              <h1>Message not found</h1>
              <Link to="/messages">Back to messages</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>{message.title}</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <p class="text-muted">{message.date} · W000001-2026</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <div class="panel-body">
                <p>{message.body}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <Link to={'/' + message.action} class="btn btn-primary">
              {message.action === 'documents' ? 'Open document checklist' : 'View application'}
            </Link>
            <Link to="/messages" class="btn btn-default">Back to messages</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
