import { useAuth } from '../context/useAuth';
import { useData } from '../context/useData';

export function Profile() {
  const { user } = useAuth();
  const { application } = useData();

  return (
    <main id="wb-cont" className="container portal-main">
      <header className="portal-page-header compact">
        <div><p className="eyebrow">Account settings</p><h1>Applicant profile</h1><p>Review the details associated with this demonstration account.</p></div>
      </header>

      <div className="profile-grid">
        <section className="portal-card" aria-labelledby="personal-title">
          <div className="section-heading"><div><p className="eyebrow">Identity</p><h2 id="personal-title">Personal information</h2></div><span className="status-pill status-complete">Verified</span></div>
          <dl className="profile-details">
            <div><dt>Full name</dt><dd>{user?.name || 'Alex Morgan'}</dd></div>
            <div><dt>Date of birth</dt><dd>March 14, 1992</dd></div>
            <div><dt>Unique client identifier</dt><dd>{application.uci}</dd></div>
            <div><dt>Passport number</dt><dd>••••••4821</dd></div>
          </dl>
        </section>
        <section className="portal-card" aria-labelledby="contact-title">
          <div className="section-heading"><div><p className="eyebrow">Notifications</p><h2 id="contact-title">Contact information</h2></div></div>
          <dl className="profile-details">
            <div><dt>Email</dt><dd>alex.morgan@example.com</dd></div>
            <div><dt>Preferred language</dt><dd>English</dd></div>
            <div><dt>Country of residence</dt><dd>Georgia</dd></div>
            <div><dt>Account username</dt><dd>{user?.username || 'alex.morgan'}</dd></div>
          </dl>
        </section>
      </div>

      <section className="inline-alert neutral">
        <strong>Need to report a change?</strong>
        <span>Profile details cannot be changed in this demo. Use the official IRCC web form for a real application.</span>
        <a href="https://www.canada.ca/en/immigration-refugees-citizenship/corporate/contact-ircc/web-form.html">Open web form</a>
      </section>
    </main>
  );
}
