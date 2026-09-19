import { useState } from 'react';
import { formatDate } from '../api';
import { useData } from '../context/useData';

export function Documents() {
  const { application, attachDocument, removeDocument } = useData();
  const [error, setError] = useState('');
  const upload = async (requestId, event) => {
    const [file] = event.target.files;
    if (!file) return;
    setError('');
    try { await attachDocument(requestId, file); } catch (requestError) { setError(requestError.message); }
  };
  return <main id="wb-cont" className="container portal-main"><header className="portal-page-header compact"><div><p className="eyebrow">{application.type} · {application.number}</p><h1>Documents</h1><p>Review documents already provided and respond to requests.</p></div></header>
    {error && <div className="inline-alert" role="alert"><strong>Document was not updated.</strong><span>{error}</span></div>}
    {application.documentRequests.length === 0 ? <section className="portal-card empty-state"><h2>No document requests</h2><p>There are no outstanding document requests for this application.</p></section> : application.documentRequests.map((request) => <section key={request.id} className={`document-request ${request.upload ? 'request-ready' : ''}`}><div className="request-header"><div><p className="eyebrow">{request.upload ? 'Ready to submit' : 'Action required'}</p><h2>{request.title}</h2></div><span className={`status-pill ${request.upload ? 'status-complete' : 'status-action'}`}>{request.upload ? 'Uploaded' : 'Required'}</span></div><p>{request.description}</p><dl className="request-facts"><div><dt>Requested</dt><dd>{formatDate(request.requestedAt)}</dd></div><div><dt>Due</dt><dd>{formatDate(request.dueAt)}</dd></div><div><dt>Accepted formats</dt><dd>{request.acceptedFormats}</dd></div><div><dt>Maximum size</dt><dd>{request.maxSizeMb} MB</dd></div></dl>
      {request.upload ? <div className="uploaded-file"><span className="file-type">FILE</span><div><strong>{request.upload.name}</strong><small>{Math.ceil(request.upload.size / 1024)} KB · selected {formatDate(request.upload.uploadedAt)}</small></div><button type="button" onClick={async () => { try { await removeDocument(request.id); } catch (requestError) { setError(requestError.message); } }}>Remove</button></div> : <div className="upload-zone"><strong>Choose a document from your device</strong><p>Only file metadata is stored in this local demonstration.</p><label className="portal-button portal-button-primary" htmlFor={`document-${request.id}`}>Choose file</label><input id={`document-${request.id}`} type="file" onChange={(event) => upload(request.id, event)} /></div>}
    </section>)}
    <section className="portal-card"><div className="section-heading"><div><p className="eyebrow">Application record</p><h2>Documents provided</h2></div></div>{application.providedDocuments.length ? <div className="responsive-table"><table className="portal-table"><thead><tr><th>Document</th><th>Date provided</th><th>Status</th></tr></thead><tbody>{application.providedDocuments.map((document) => <tr key={document.id}><td><strong>{document.title}</strong><small>{document.description}</small></td><td>{formatDate(document.providedAt)}</td><td><span className="status-pill status-complete">{document.status}</span></td></tr>)}</tbody></table></div> : <p>No provided documents are recorded.</p>}</section>
  </main>;
}
