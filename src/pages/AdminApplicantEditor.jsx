import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, formatDate } from '../api';
import { ApplicationTypeFields } from '../components/ApplicationTypeFields';
import { ApplicationTypeSelect } from '../components/ApplicationTypeSelect';
import { AdminAccordion } from '../components/AdminAccordion';

const definitions = {
  stages: {
    title: 'Timeline stages', icon: 'fas fa-stream', description: 'Processing milestones, status, and display order', empty: 'No timeline stages have been added.',
    fields: [
      ['label', 'Stage label', 'text'], ['state', 'State', 'select', ['waiting', 'current', 'complete']],
      ['date', 'Displayed date or note', 'text'], ['detail', 'Description', 'textarea'],
    ],
  },
  'document-requests': {
    title: 'Document requests', icon: 'fas fa-file-upload', description: 'Requests, deadlines, and applicant uploads', empty: 'No documents are currently requested.',
    fields: [
      ['title', 'Request title', 'text'], ['description', 'Instructions', 'textarea'],
      ['requestedAt', 'Requested date', 'date'], ['dueAt', 'Due date', 'date'],
      ['acceptedFormats', 'Accepted formats', 'text'], ['maxSizeMb', 'Maximum size (MB)', 'number'],
    ],
  },
  'provided-documents': {
    title: 'Documents provided', icon: 'fas fa-folder-open', description: 'Documents already received for this application', empty: 'No provided documents are recorded.',
    fields: [
      ['title', 'Document title', 'text'], ['description', 'Description', 'text'],
      ['providedAt', 'Date provided', 'date'], ['status', 'Status', 'text'],
    ],
  },
  messages: {
    title: 'Messages', icon: 'fas fa-envelope', description: 'Correspondence and applicant read status', empty: 'No messages have been sent.',
    fields: [
      ['title', 'Message title', 'text'], ['type', 'Message type', 'text'], ['sentAt', 'Sent date', 'date'],
      ['body', 'Message body', 'textarea'], ['action', 'Action link', 'select', ['none', 'status', 'documents']],
    ],
  },
};

function EditorField({ definition, value, onChange }) {
  const [key, label, type, options] = definition;
  const controlProps = { value: value ?? '', onChange: (event) => onChange(key, event.target.value) };
  return <div className={`form-field ${type === 'textarea' ? 'full-width' : ''}`}><label>{label}
    {type === 'textarea' ? <textarea rows="3" {...controlProps} /> : type === 'select' ? <select {...controlProps}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input type={type} {...controlProps} />}
  </label></div>;
}

function CollectionItem({ applicantId, collection, item, index, count, onRefresh, onMove }) {
  const [values, setValues] = useState(item);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const definition = definitions[collection];
  const save = async () => {
    setSaving(true); setError('');
    try { await api(`/admin/users/${applicantId}/collections/${collection}/${item.id}`, { method: 'PATCH', body: JSON.stringify(values) }); await onRefresh(); }
    catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };
  const remove = async () => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    try { await api(`/admin/users/${applicantId}/collections/${collection}/${item.id}`, { method: 'DELETE' }); await onRefresh(); }
    catch (requestError) { setError(requestError.message); }
  };
  return <article className="admin-collection-item">
    <div className="admin-form-grid">{definition.fields.map((field) => <EditorField key={field[0]} definition={field} value={values[field[0]]} onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))} />)}</div>
    {collection === 'document-requests' && <p className="admin-activity"><strong>Applicant upload:</strong> {item.upload ? `${item.upload.name} (${Math.ceil(item.upload.size / 1024)} KB), ${formatDate(item.upload.uploadedAt)}` : 'Nothing uploaded'}</p>}
    {collection === 'messages' && <p className="admin-activity"><strong>Applicant read status:</strong> {item.readAt ? `Read ${formatDate(item.readAt)}` : 'Unread'}</p>}
    {error && <p className="field-error" role="alert">{error}</p>}
    <div className="admin-item-actions"><button type="button" className="portal-button portal-button-primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</button>
      {collection === 'stages' && <><button type="button" disabled={index === 0} onClick={() => onMove(index, -1)}>Move up</button><button type="button" disabled={index === count - 1} onClick={() => onMove(index, 1)}>Move down</button></>}
      <button type="button" className="danger-link" onClick={remove}>Delete</button></div>
  </article>;
}

function CollectionSection({ applicantId, collection, items, onRefresh }) {
  const definition = definitions[collection];
  const defaultValues = Object.fromEntries(definition.fields.map(([key, , type, options]) => [key, type === 'select' ? options[0] : '']));
  const [newItem, setNewItem] = useState(defaultValues);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const add = async (event) => {
    event.preventDefault(); setAdding(true); setError('');
    try { await api(`/admin/users/${applicantId}/collections/${collection}`, { method: 'POST', body: JSON.stringify(newItem) }); setNewItem(defaultValues); await onRefresh(); }
    catch (requestError) { setError(requestError.message); }
    finally { setAdding(false); }
  };
  const move = async (index, direction) => {
    const ids = items.map((item) => item.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    try { await api(`/admin/users/${applicantId}/stages/order`, { method: 'PUT', body: JSON.stringify({ ids }) }); await onRefresh(); }
    catch (requestError) { setError(requestError.message); }
  };
  return <AdminAccordion title={definition.title} description={definition.description} icon={definition.icon} badge={items.length}>
    {items.length === 0 && <p className="empty-copy">{definition.empty}</p>}
    <div className="admin-collection">{items.map((item, index) => <CollectionItem key={item.id} applicantId={applicantId} collection={collection} item={item} index={index} count={items.length} onRefresh={onRefresh} onMove={move} />)}</div>
    <form className="admin-add-form" onSubmit={add}><h3>Add {definition.title.toLowerCase().replace(/s$/, '')}</h3><div className="admin-form-grid">
      {definition.fields.map((field) => <EditorField key={field[0]} definition={field} value={newItem[field[0]]} onChange={(key, value) => setNewItem((current) => ({ ...current, [key]: value }))} />)}
    </div>{error && <p className="field-error" role="alert">{error}</p>}<button disabled={adding} className="portal-button portal-button-secondary">{adding ? 'Adding…' : 'Add item'}</button></form>
  </AdminAccordion>;
}

export function AdminApplicantEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [account, setAccount] = useState(null);
  const [application, setApplication] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const result = (await api(`/admin/users/${id}`)).applicant;
      setApplicant(result); setAccount({ username: result.username, active: result.active, profile: result.profile }); setApplication(result.application);
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [id]);
  // Initial remote aggregate load.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { load(); }, [load]);
  const saveAccount = async (event) => {
    event.preventDefault(); setError(''); setNotice('');
    try { await api(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(account) }); setNotice('Account and profile saved.'); await load(); }
    catch (requestError) { setError(requestError.message); }
  };
  const saveApplication = async (event) => {
    event.preventDefault(); setError(''); setNotice('');
    try { await api(`/admin/users/${id}/application`, { method: 'PATCH', body: JSON.stringify(application) }); setNotice('Application summary saved.'); await load(); }
    catch (requestError) { setError(requestError.message); }
  };
  const changePassword = async (event) => {
    event.preventDefault(); setError('');
    try { await api(`/admin/users/${id}/password`, { method: 'PUT', body: JSON.stringify({ password }) }); setPassword(''); setNotice('Password reset.'); }
    catch (requestError) { setError(requestError.message); }
  };
  const permanentlyDelete = async () => {
    if (window.prompt(`Type ${applicant.username} to permanently delete this applicant and all application data.`) !== applicant.username) return;
    try { await api(`/admin/users/${id}`, { method: 'DELETE' }); navigate('/admin', { replace: true }); }
    catch (requestError) { setError(requestError.message); }
  };
  if (loading) return <main className="container portal-main"><p>Loading applicant…</p></main>;
  if (!applicant) return <main className="container portal-main"><h1>Applicant unavailable</h1><div className="inline-alert" role="alert"><span>{error}</span></div><Link to="/admin">Back to applicants</Link></main>;
  const setProfile = (key, value) => setAccount((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));
  const appField = (key, value) => setApplication((current) => ({ ...current, [key]: value }));
  const applicationDetail = (key, value) => setApplication((current) => ({ ...current, details: { ...(current.details || {}), [key]: value } }));
  const initials = applicant.profile.fullName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <main id="wb-cont" className="container portal-main admin-editor">
    <Link className="back-link" to="/admin">← Back to applicants</Link>
    <header className="admin-record-hero"><div className="admin-record-avatar" aria-hidden="true">{initials}</div><div className="admin-record-title"><p className="eyebrow">Applicant record</p><h1>{applicant.profile.fullName}</h1><p>{applicant.application.type} <span aria-hidden="true">•</span> {applicant.application.number}</p></div><span className={`status-pill ${applicant.active ? 'status-complete' : 'status-waiting'}`}>{applicant.active ? 'Active account' : 'Inactive account'}</span></header>
    {error && <div className="inline-alert" role="alert"><strong>Could not complete that action.</strong><span>{error}</span></div>}
    {notice && <div className="success-banner" role="status"><strong>{notice}</strong></div>}
    <div className="admin-workspace">
      <aside className="admin-record-sidebar" aria-label="Applicant summary"><div className="admin-sidebar-card"><p className="eyebrow">At a glance</p><h2>Record summary</h2><dl className="admin-summary-list"><div><dt>Username</dt><dd>{applicant.username}</dd></div><div><dt>Application</dt><dd>{applicant.application.type}</dd></div><div><dt>Current status</dt><dd>{applicant.application.status}</dd></div><div><dt>Last updated</dt><dd>{formatDate(applicant.application.lastUpdatedAt)}</dd></div></dl></div><div className="admin-sidebar-note"><span className="fas fa-info-circle" aria-hidden="true" /><p>Save each section separately. Updates appear in the applicant account after navigation or refresh.</p></div></aside>
      <div className="admin-accordion-stack">
    <AdminAccordion title="Account and profile" icon="fas fa-user-circle" description="Credentials, access, identity, and contact information" defaultOpen><form onSubmit={saveAccount}><div className="admin-form-grid">
      <EditorField definition={['username', 'Username', 'text']} value={account.username} onChange={(key, value) => setAccount((current) => ({ ...current, [key]: value }))} />
      <EditorField definition={['fullName', 'Full name', 'text']} value={account.profile.fullName} onChange={setProfile} />
      <EditorField definition={['dateOfBirth', 'Date of birth', 'date']} value={account.profile.dateOfBirth} onChange={setProfile} />
      <EditorField definition={['email', 'Email', 'email']} value={account.profile.email} onChange={setProfile} />
      <EditorField definition={['preferredLanguage', 'Preferred language', 'select', ['English', 'French']]} value={account.profile.preferredLanguage} onChange={setProfile} />
      <EditorField definition={['countryOfResidence', 'Country of residence', 'text']} value={account.profile.countryOfResidence} onChange={setProfile} />
      <EditorField definition={['passportLastFour', 'Passport last 4 digits', 'text']} value={account.profile.passportLastFour} onChange={setProfile} />
      <div className="form-field"><label><input type="checkbox" checked={account.active} onChange={(e) => setAccount((current) => ({ ...current, active: e.target.checked }))} /> Account active</label></div>
    </div><button className="portal-button portal-button-primary">Save account</button></form></AdminAccordion>
    <AdminAccordion title="Application summary" icon="fas fa-clipboard-list" description="Type, identifiers, purpose, and current status"><form onSubmit={saveApplication}><div className="admin-form-grid">
      <ApplicationTypeSelect value={application.type} onChange={(type) => setApplication((current) => ({ ...current, type, details: {} }))} />
      {['number', 'uci', 'purpose', 'status'].map((key) => <EditorField key={key} definition={[key, { number: 'Application number', uci: 'UCI', purpose: 'Purpose', status: 'Overall status' }[key], 'text']} value={application[key]} onChange={appField} />)}
      <EditorField definition={['submittedAt', 'Submission date', 'date']} value={application.submittedAt} onChange={appField} />
      <ApplicationTypeFields type={application.type} values={application.details} onChange={applicationDetail} />
    </div><button className="portal-button portal-button-primary">Save application</button></form></AdminAccordion>
    <CollectionSection applicantId={id} collection="stages" items={applicant.application.stages} onRefresh={load} />
    <CollectionSection applicantId={id} collection="document-requests" items={applicant.application.documentRequests} onRefresh={load} />
    <CollectionSection applicantId={id} collection="provided-documents" items={applicant.application.providedDocuments} onRefresh={load} />
    <CollectionSection applicantId={id} collection="messages" items={applicant.application.messages} onRefresh={load} />
    <AdminAccordion title="Security and account lifecycle" icon="fas fa-shield-alt" description="Password reset and permanent deletion"><form onSubmit={changePassword} className="password-reset"><label>New password<input type="password" minLength="8" required value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="portal-button portal-button-secondary">Reset password</button></form><div className="admin-danger-zone"><h3>Permanent deletion</h3><p>Deleting this applicant also deletes the entire application record. This cannot be undone.</p><button type="button" className="portal-button danger-button" onClick={permanentlyDelete}>Delete applicant permanently</button></div></AdminAccordion>
      </div>
    </div>
  </main>;
}
