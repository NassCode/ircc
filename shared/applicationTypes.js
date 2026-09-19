export const APPLICATION_TYPES = [
  'Visitor visa',
  'Study permit',
  'Work permit',
  'Work and labour',
  'Invitation',
  'Sponsorship',
];

const personFields = [
  { key: 'personFullName', label: 'Full name', type: 'text', required: true },
  { key: 'relationship', label: 'Relationship to applicant', type: 'text', required: true },
  { key: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
  { key: 'citizenship', label: 'Citizenship', type: 'text', required: true },
  { key: 'countryOfResidence', label: 'Country of residence', type: 'text' },
  { key: 'passportNumber', label: 'Passport number', type: 'text', required: true },
  { key: 'passportExpiry', label: 'Passport expiry date', type: 'date' },
];

const fieldsByType = {
  'Work and labour': [
    { key: 'employerName', label: 'Employer or organization', type: 'text', required: true },
    { key: 'jobTitle', label: 'Job title', type: 'text', required: true },
    { key: 'occupation', label: 'Occupation or NOC description', type: 'text' },
    { key: 'workLocation', label: 'Work location', type: 'text', required: true },
    { key: 'employerAddress', label: 'Employer address', type: 'textarea' },
    { key: 'lmiaNumber', label: 'LMIA or authorization number', type: 'text' },
    { key: 'employmentStartDate', label: 'Employment start date', type: 'date', required: true },
    { key: 'employmentEndDate', label: 'Employment end date', type: 'date' },
  ],
  Invitation: [
    ...personFields,
    { key: 'invitationPurpose', label: 'Purpose of invitation', type: 'textarea', required: true },
    { key: 'plannedArrival', label: 'Planned arrival date', type: 'date' },
    { key: 'plannedDeparture', label: 'Planned departure date', type: 'date' },
  ],
  Sponsorship: [
    ...personFields,
    { key: 'sponsorshipCategory', label: 'Sponsorship category', type: 'select', required: true,
      options: ['Spouse or partner', 'Dependent child', 'Parent or grandparent', 'Other relative'] },
    { key: 'maritalStatus', label: 'Marital status', type: 'select',
      options: ['Single', 'Married', 'Common-law', 'Divorced', 'Widowed', 'Other'] },
    { key: 'dependants', label: 'Number of dependants', type: 'number' },
  ],
};

export function getApplicationDetailFields(type) {
  return fieldsByType[type] || [];
}

export function getApplicationDetailsTitle(type) {
  if (type === 'Work and labour') return 'Employment details';
  if (type === 'Invitation') return 'Invited person and travel details';
  if (type === 'Sponsorship') return 'Sponsored person details';
  return '';
}
