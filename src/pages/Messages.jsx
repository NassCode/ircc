import { Link } from 'react-router-dom';
import { useData } from '../context/useData';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function Messages() {
  const { messages, readMessages } = useData();

  return (
    <>
      <Header />
      <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement" class="container">
        <div class="row">
          <div class="col-md-12">
            <h1 property="name" id="wb-cont" dir="ltr">
              <span>Messages</span>
            </h1>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td>{m.date}</td>
                    <td>
                      <Link to={`/messages/${m.id}`}>{m.title}</Link>
                    </td>
                    <td>
                      <span class={`label ${readMessages.has(m.id) ? 'label-default' : 'label-warning'}`}>
                        {readMessages.has(m.id) ? 'Read' : 'Unread'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
