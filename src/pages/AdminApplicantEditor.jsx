import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, formatDate } from '../api';
import { ApplicationTypeFields } from '../components/ApplicationTypeFields';
import { ApplicationTypeSelect } from '../components/ApplicationTypeSelect';

const definitions = {
  stages: {
    title: 'Timeline stages', empty: 'No timeline stages have been added.',
    fields: [
      ['label', 'Stage label', 'text'], ['state', 'State', 'select', ['waiting', 'current', 'complete']],
      ['date', 'Displayed date or note', 'text'], ['detail', 'Description', 'textarea'],
    ],
  },
  'document-requests': {
    title: 'Document requests', empty: 'No documents are currently requested.',
    fields: [
      ['title', 'Request title', 'text'], ['description', 'Instructions', 'textarea'],
      ['requestedAt', 'Requested date', 'date'], ['dueAt', 'Due date', 'date'],
      ['acceptedFormats', 'Accepted formats', 'text'], ['maxSizeMb', 'Maximum size (MB)', 'number'],
    ],
  },
  'provided-documents': {
    title: 'Documents provided', empty: 'No provided documents are recorded.',
    fields: [
      ['title', 'Document title', 'text'], ['description', 'Description', 'text'],
      ['providedAt', 'Date provided', 'date'], ['status', 'Status', 'text'],
    ],
  },
  messages: {
    title: 'Messages', empty: 'No messages have been sent.',
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
  return <section className="portal-card admin-form-section"><h2>{definition.title}</h2>
    {items.length === 0 && <p className="empty-copy">{definition.empty}</p>}
    <div className="admin-collection">{items.map((item, index) => <CollectionItem key={item.id} applicantId={applicantId} collection={collection} item={item} index={index} count={items.length} onRefresh={onRefresh} onMove={move} />)}</div>
    <form className="admin-add-form" onSubmit={add}><h3>Add {definition.title.toLowerCase().replace(/s$/, '')}</h3><div className="admin-form-grid">
      {definition.fields.map((field) => <EditorField key={field[0]} definition={field} value={newItem[field[0]]} onChange={(key, value) => setNewItem((current) => ({ ...current, [key]: value }))} />)}
    </div>{error && <p className="field-error" role="alert">{error}</p>}<button disabled={adding} className="portal-button portal-button-secondary">{adding ? 'Adding…' : 'Add item'}</button></form>
  </section>;
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
  return <main id="wb-cont" className="container portal-main admin-editor">
    <Link className="back-link" to="/admin">← Back to applicants</Link>
    <header className="portal-page-header compact"><div><p className="eyebrow">Applicant record</p><h1>{applicant.profile.fullName}</h1><p>{applicant.application.type} · {applicant.application.number}</p></div><span className={`status-pill ${applicant.active ? 'status-complete' : 'status-waiting'}`}>{applicant.active ? 'Active' : 'Inactive'}</span></header>
    {error && <div className="inline-alert" role="alert"><strong>Could not complete that action.</strong><span>{error}</span></div>}
    {notice && <div className="success-banner" role="status"><strong>{notice}</strong></div>}
    <form className="portal-card admin-form-section" onSubmit={saveAccount}><h2>Account and profile</h2><div className="admin-form-grid">
      <EditorField definition={['username', 'Username', 'text']} value={account.username} onChange={(key, value) => setAccount((current) => ({ ...current, [key]: value }))} />
      <EditorField definition={['fullName', 'Full name', 'text']} value={account.profile.fullName} onChange={setProfile} />
      <EditorField definition={['dateOfBirth', 'Date of birth', 'date']} value={account.profile.dateOfBirth} onChange={setProfile} />
      <EditorField definition={['email', 'Email', 'email']} value={account.profile.email} onChange={setProfile} />
      <EditorField definition={['preferredLanguage', 'Preferred language', 'select', ['English', 'French']]} value={account.profile.preferredLanguage} onChange={setProfile} />
      <EditorField definition={['countryOfResidence', 'Country of residence', 'text']} value={account.profile.countryOfResidence} onChange={setProfile} />
      <EditorField definition={['passportLastFour', 'Passport last 4 digits', 'text']} value={account.profile.passportLastFour} onChange={setProfile} />
      <div className="form-field"><label><input type="checkbox" checked={account.active} onChange={(e) => setAccount((current) => ({ ...current, active: e.target.checked }))} /> Account active</label></div>
    </div><button className="portal-button portal-button-primary">Save account</button></form>
    <form className="portal-card admin-form-section" onSubmit={saveApplication}><h2>Application summary</h2><div className="admin-form-grid">
      <ApplicationTypeSelect value={application.type} onChange={(type) => setApplication((current) => ({ ...current, type, details: {} }))} />
      {['number', 'uci', 'purpose', 'status'].map((key) => <EditorField key={key} definition={[key, { number: 'Application number', uci: 'UCI', purpose: 'Purpose', status: 'Overall status' }[key], 'text']} value={application[key]} onChange={appField} />)}
      <EditorField definition={['submittedAt', 'Submission date', 'date']} value={application.submittedAt} onChange={appField} />
      <ApplicationTypeFields type={application.type} values={application.details} onChange={applicationDetail} />
    </div><button className="portal-button portal-button-primary">Save application</button></form>
    <CollectionSection applicantId={id} collection="stages" items={applicant.application.stages} onRefresh={load} />
    <CollectionSection applicantId={id} collection="document-requests" items={applicant.application.documentRequests} onRefresh={load} />
    <CollectionSection applicantId={id} collection="provided-documents" items={applicant.application.providedDocuments} onRefresh={load} />
    <CollectionSection applicantId={id} collection="messages" items={applicant.application.messages} onRefresh={load} />
    <section className="portal-card admin-form-section"><h2>Security and account lifecycle</h2><form onSubmit={changePassword} className="password-reset"><label>New password<input type="password" minLength="8" required value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="portal-button portal-button-secondary">Reset password</button></form><hr /><h3>Permanent deletion</h3><p>Deleting this applicant also deletes the entire application record. This cannot be undone.</p><button type="button" className="portal-button danger-button" onClick={permanentlyDelete}>Delete applicant permanently</button></section>
  </main>;
}
