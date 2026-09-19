import { APPLICATION_TYPES } from '../../shared/applicationTypes';

const customValue = '__custom__';

export function ApplicationTypeSelect({ value, onChange, id = 'application-type' }) {
  const isPreset = APPLICATION_TYPES.includes(value);
  return <div className="form-field application-type-select">
    <label htmlFor={id}>Application type</label>
    <select id={id} required value={isPreset ? value : customValue} onChange={(event) => onChange(event.target.value === customValue ? '' : event.target.value)}>
      {APPLICATION_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
      <option value={customValue}>Custom application type</option>
    </select>
    {!isPreset && <label className="custom-type-label" htmlFor={`${id}-custom`}>Custom application type
      <input id={`${id}-custom`} required value={value} onChange={(event) => onChange(event.target.value)} />
    </label>}
  </div>;
}
