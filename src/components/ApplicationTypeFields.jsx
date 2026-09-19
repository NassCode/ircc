import { getApplicationDetailFields, getApplicationDetailsTitle } from '../../shared/applicationTypes';

export function ApplicationTypeFields({ type, values = {}, onChange }) {
  const fields = getApplicationDetailFields(type);
  if (!fields.length) return null;
  return <div className="type-specific-fields full-width"><h3>{getApplicationDetailsTitle(type)}</h3><p>Fields marked with an asterisk are required for this application type.</p><div className="admin-form-grid">
    {fields.map((field) => <div key={field.key} className={`form-field ${field.type === 'textarea' ? 'full-width' : ''}`}><label>{field.label}{field.required ? ' *' : ''}
      {field.type === 'textarea' ? <textarea rows="3" required={field.required} value={values[field.key] ?? ''} onChange={(event) => onChange(field.key, event.target.value)} />
        : field.type === 'select' ? <select required={field.required} value={values[field.key] ?? ''} onChange={(event) => onChange(field.key, event.target.value)}><option value="">Select</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
          : <input type={field.type} min={field.type === 'number' ? '0' : undefined} required={field.required} value={values[field.key] ?? ''} onChange={(event) => onChange(field.key, event.target.value)} />}
    </label></div>)}
  </div></div>;
}
