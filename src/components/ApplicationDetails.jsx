import { formatDate } from '../api';
import { getApplicationDetailFields, getApplicationDetailsTitle } from '../../shared/applicationTypes';

export function ApplicationDetails({ application }) {
  const fields = getApplicationDetailFields(application.type);
  if (!fields.length) return null;
  const visibleFields = fields.filter((field) => application.details?.[field.key] !== '' && application.details?.[field.key] !== undefined);
  if (!visibleFields.length) return null;
  return <section className="portal-card application-details-card" aria-labelledby="application-details-title">
    <div className="section-heading"><div><p className="eyebrow">Application information</p><h2 id="application-details-title">{getApplicationDetailsTitle(application.type)}</h2></div></div>
    <dl className="application-specific-details">{visibleFields.map((field) => <div key={field.key}><dt>{field.label}</dt><dd>{field.type === 'date' ? formatDate(application.details[field.key]) : application.details[field.key]}</dd></div>)}</dl>
  </section>;
}
