import { useData } from '../context/useData';

export function Documents() {
  const { application, attached, attachmentName, attachDocument, removeDocument } = useData();

  const handleFile = (event) => {
    const [file] = event.target.files;
    if (file) attachDocument(file.name);
  };

  return (
    <main id="wb-cont" className="container portal-main">
      <header className="portal-page-header compact">
        <div>
          <p className="eyebrow">{application.type} · {application.number}</p>
          <h1>Documents</h1>
          <p>Review documents already provided and respond to new requests.</p>
        </div>
      </header>

      <section className={`document-request ${attached ? 'request-ready' : ''}`} aria-labelledby="request-title">
        <div className="request-header">
          <div>
            <p className="eyebrow">{attached ? 'Ready to submit' : 'Action required'}</p>
            <h2 id="request-title">Updated proof of funds</h2>
          </div>
          <span className={`status-pill ${attached ? 'status-complete' : 'status-action'}`}>
            {attached ? 'Uploaded' : 'Required'}
          </span>
        </div>
        <p>Provide a recent bank statement showing your name, account details, available balance, and recent transaction history.</p>
        <dl className="request-facts">
          <div><dt>Requested</dt><dd>September 3, 2026</dd></div>
          <div><dt>Due</dt><dd>{application.nextActionDue}</dd></div>
          <div><dt>Accepted formats</dt><dd>PDF, JPG or PNG</dd></div>
          <div><dt>Maximum size</dt><dd>4 MB</dd></div>
        </dl>

        {attached ? (
          <div className="uploaded-file">
            <span className="file-type" aria-hidden="true">FILE</span>
            <div><strong>{attachmentName}</strong><small>Selected for this demonstration</small></div>
            <button type="button" onClick={removeDocument}>Remove</button>
          </div>
        ) : (
          <div className="upload-zone">
            <strong>Choose a document from your device</strong>
            <p>Your file stays in this local demo and is not sent to IRCC.</p>
            <label className="portal-button portal-button-primary" htmlFor="supporting-document">Choose file</label>
            <input id="supporting-document" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
          </div>
        )}
      </section>

      <section className="portal-card" aria-labelledby="provided-title">
        <div className="section-heading"><div><p className="eyebrow">Application record</p><h2 id="provided-title">Documents provided</h2></div></div>
        <div className="responsive-table">
          <table className="portal-table">
            <thead><tr><th>Document</th><th>Date provided</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td><strong>Visitor visa application form</strong><small>IMM 5257</small></td><td>August 20, 2026</td><td><span className="status-pill status-complete">Received</span></td></tr>
              <tr><td><strong>Passport biodata page</strong><small>Travel document copy</small></td><td>August 20, 2026</td><td><span className="status-pill status-complete">Received</span></td></tr>
              <tr><td><strong>Purpose of travel</strong><small>Itinerary and accommodation</small></td><td>August 20, 2026</td><td><span className="status-pill status-complete">Received</span></td></tr>
              <tr><td><strong>Digital photo</strong><small>Applicant photo</small></td><td>August 20, 2026</td><td><span className="status-pill status-complete">Received</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
