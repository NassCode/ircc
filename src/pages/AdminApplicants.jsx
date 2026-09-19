import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../api';

export function AdminApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async (search = '') => {
    setLoading(true); setError('');
    try { setApplicants((await api(`/admin/users?q=${encodeURIComponent(search)}`)).applicants); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  };
  // Initial remote collection load.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { load(); }, []);
  return (
    <main id="wb-cont" className="container portal-main">
      <header className="portal-page-header"><div><p className="eyebrow">Control panel</p><h1>Applicants</h1><p>Create accounts and manage application records.</p></div><Link className="portal-button portal-button-primary" to="/admin/users/new">Create applicant</Link></header>
      <form className="admin-search" onSubmit={(event) => { event.preventDefault(); load(query); }}>
        <label htmlFor="applicant-search">Search by name, username, or application number</label>
        <div><input id="applicant-search" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="portal-button portal-button-primary">Search</button><button type="button" className="portal-button portal-button-secondary" onClick={() => { setQuery(''); load(); }}>Clear</button></div>
      </form>
      {error && <div className="inline-alert" role="alert"><strong>Could not load applicants.</strong><span>{error}</span></div>}
      {loading ? <p>Loading applicants…</p> : applicants.length === 0 ? <section className="portal-card empty-state"><h2>No applicants found</h2><p>Create the first applicant account or change your search.</p></section> : (
        <div className="responsive-table"><table className="portal-table admin-table"><thead><tr><th>Applicant</th><th>Application</th><th>Status</th><th>Last updated</th><th><span className="wb-inv">Action</span></th></tr></thead><tbody>
          {applicants.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.username} · {item.active ? 'Active' : 'Inactive'}</small></td><td>{item.applicationType}<small>{item.applicationNumber}</small></td><td><span className={`status-pill ${item.active ? 'status-current' : 'status-waiting'}`}>{item.applicationStatus}</span></td><td>{formatDate(item.lastUpdatedAt)}</td><td><Link to={`/admin/users/${item.id}`}>Manage</Link></td></tr>)}
        </tbody></table></div>
      )}
    </main>
  );
}
