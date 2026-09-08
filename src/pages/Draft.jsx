import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '../context/useData';

export function Draft() {
  const { saveDraft } = useData();
  const [appType, setAppType] = useState(() => sessionStorage.getItem('ircc-type') || 'Visitor visa');
  const [purpose, setPurpose] = useState(() => sessionStorage.getItem('ircc-purpose') || 'Tourism');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    saveDraft();
    sessionStorage.setItem('ircc-type', appType);
    sessionStorage.setItem('ircc-purpose', purpose);
    setFeedback('Your demonstration draft has been saved in this browser session.');
  };

  return (
    <main id="wb-cont" className="container portal-main narrow-main">
      <Link className="back-link" to="/dashboard">← Back to overview</Link>
      <header className="portal-page-header compact"><div><p className="eyebrow">New application</p><h1>Start another application</h1><p>Set up a fictional draft. This does not affect your submitted visitor visa application.</p></div></header>
      {feedback && <div className="success-banner" role="status"><strong>Draft saved.</strong> {feedback}</div>}
      <form onSubmit={handleSubmit} className="portal-card portal-form">
        <div className="form-field">
          <label htmlFor="type">Application type</label>
          <select id="type" value={appType} onChange={(event) => setAppType(event.target.value)}>
            <option>Visitor visa</option><option>Study permit</option><option>Work permit</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="purpose">Purpose</label>
          <select id="purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)}>
            <option>Tourism</option><option>Visit family</option><option>Business visit</option><option>Study</option><option>Work</option>
          </select>
        </div>
        <div className="form-actions"><button type="submit" className="portal-button portal-button-primary">Save draft</button><Link to="/dashboard" className="portal-button portal-button-secondary">Cancel</Link></div>
      </form>
    </main>
  );
}
