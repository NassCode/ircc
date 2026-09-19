import { formatDate } from '../api';
import { useData } from '../context/useData';

export function Profile() {
  const { applicant, application } = useData();
  const profile = applicant.profile;
  return <main id="wb-cont" className="container portal-main"><header className="portal-page-header compact"><div><p className="eyebrow">Account settings</p><h1>Applicant profile</h1><p>Review the details associated with this account.</p></div></header><div className="profile-grid">
    <section className="portal-card"><div className="section-heading"><div><p className="eyebrow">Identity</p><h2>Personal information</h2></div></div><dl className="profile-details"><div><dt>Full name</dt><dd>{profile.fullName}</dd></div><div><dt>Date of birth</dt><dd>{formatDate(profile.dateOfBirth)}</dd></div><div><dt>Unique client identifier</dt><dd>{application.uci || 'Not provided'}</dd></div><div><dt>Passport number</dt><dd>{profile.passportLastFour ? `••••••${profile.passportLastFour}` : 'Not provided'}</dd></div></dl></section>
    <section className="portal-card"><div className="section-heading"><div><p className="eyebrow">Notifications</p><h2>Contact information</h2></div></div><dl className="profile-details"><div><dt>Email</dt><dd>{profile.email || 'Not provided'}</dd></div><div><dt>Preferred language</dt><dd>{profile.preferredLanguage || 'Not provided'}</dd></div><div><dt>Country of residence</dt><dd>{profile.countryOfResidence || 'Not provided'}</dd></div><div><dt>Account username</dt><dd>{applicant.username}</dd></div></dl></section>
  </div><section className="inline-alert neutral"><strong>Need to report a change?</strong><span>Contact the administrator responsible for this account.</span></section></main>;
}
