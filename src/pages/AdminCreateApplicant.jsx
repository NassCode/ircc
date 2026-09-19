import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { ApplicationTypeFields } from '../components/ApplicationTypeFields';
import { ApplicationTypeSelect } from '../components/ApplicationTypeSelect';

const initialForm = {
  username: '', password: '',
  profile: { fullName: '', dateOfBirth: '', email: '', preferredLanguage: 'English', countryOfResidence: '', passportLastFour: '' },
  application: { type: 'Visitor visa', number: '', uci: '', purpose: '', submittedAt: '', status: 'Application received', details: {} },
};

function Field({ label, children }) {
  return <div className="form-field"><label>{label}{children}</label></div>;
}

export function AdminCreateApplicant() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const setRoot = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setNested = (section, key, value) => setForm((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  const setApplicationDetail = (key, value) => setForm((current) => ({ ...current, application: { ...current.application, details: { ...current.application.details, [key]: value } } }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { const { applicant } = await api('/admin/users', { method: 'POST', body: JSON.stringify(form) }); navigate(`/admin/users/${applicant.id}`, { replace: true }); }
    catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };
  return (
    <main id="wb-cont" className="container portal-main narrow-main admin-editor">
      <Link className="back-link" to="/admin">← Back to applicants</Link>
      <header className="portal-page-header compact"><div><p className="eyebrow">New account</p><h1>Create applicant</h1><p>Create sign-in credentials, a profile, and the applicant’s assigned application.</p></div></header>
      {error && <div className="inline-alert" role="alert"><strong>Applicant was not created.</strong><span>{error}</span></div>}
      <form onSubmit={submit}>
        <section className="portal-card admin-form-section"><h2>Account credentials</h2><div className="admin-form-grid">
          <Field label="Username"><input required value={form.username} onChange={(e) => setRoot('username', e.target.value)} /></Field>
          <Field label="Temporary password"><input required minLength="8" type="password" value={form.password} onChange={(e) => setRoot('password', e.target.value)} /></Field>
        </div></section>
        <section className="portal-card admin-form-section"><h2>Applicant profile</h2><div className="admin-form-grid">
          <Field label="Full name"><input required value={form.profile.fullName} onChange={(e) => setNested('profile', 'fullName', e.target.value)} /></Field>
          <Field label="Date of birth"><input type="date" value={form.profile.dateOfBirth} onChange={(e) => setNested('profile', 'dateOfBirth', e.target.value)} /></Field>
          <Field label="Email"><input type="email" value={form.profile.email} onChange={(e) => setNested('profile', 'email', e.target.value)} /></Field>
          <Field label="Preferred language"><select value={form.profile.preferredLanguage} onChange={(e) => setNested('profile', 'preferredLanguage', e.target.value)}><option>English</option><option>French</option></select></Field>
          <Field label="Country of residence"><input value={form.profile.countryOfResidence} onChange={(e) => setNested('profile', 'countryOfResidence', e.target.value)} /></Field>
          <Field label="Passport last 4 digits"><input inputMode="numeric" maxLength="4" value={form.profile.passportLastFour} onChange={(e) => setNested('profile', 'passportLastFour', e.target.value)} /></Field>
        </div></section>
        <section className="portal-card admin-form-section"><h2>Assigned application</h2><div className="admin-form-grid">
          <ApplicationTypeSelect value={form.application.type} onChange={(type) => setForm((current) => ({ ...current, application: { ...current.application, type, details: {} } }))} />
          <Field label="Application number"><input required value={form.application.number} onChange={(e) => setNested('application', 'number', e.target.value)} /></Field>
          <Field label="UCI"><input value={form.application.uci} onChange={(e) => setNested('application', 'uci', e.target.value)} /></Field>
          <Field label="Purpose"><input value={form.application.purpose} onChange={(e) => setNested('application', 'purpose', e.target.value)} /></Field>
          <Field label="Submission date"><input type="date" value={form.application.submittedAt} onChange={(e) => setNested('application', 'submittedAt', e.target.value)} /></Field>
          <Field label="Overall status"><input required value={form.application.status} onChange={(e) => setNested('application', 'status', e.target.value)} /></Field>
          <ApplicationTypeFields type={form.application.type} values={form.application.details} onChange={setApplicationDetail} />
        </div></section>
        <div className="form-actions"><button disabled={saving} className="portal-button portal-button-primary">{saving ? 'Creating…' : 'Create applicant'}</button><Link className="portal-button portal-button-secondary" to="/admin">Cancel</Link></div>
      </form>
    </main>
  );
}
