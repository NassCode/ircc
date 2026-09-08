import { useCallback, useState } from 'react';
import { DataContext } from './DataContextValue';

const initialMessages = [
  {
    id: 'documents',
    title: 'Action required: upload proof of funds',
    date: 'September 3, 2026',
    type: 'Document request',
    body: 'We need an updated bank statement to continue reviewing your visitor visa application. Upload the requested document by September 18, 2026. Do not mail a copy unless we ask you to.',
    action: 'documents'
  },
  {
    id: 'biometrics',
    title: 'Biometrics received',
    date: 'August 29, 2026',
    type: 'Status update',
    body: 'We received your fingerprints and photo. You do not need to provide biometrics again for this application unless we contact you.',
    action: 'status'
  },
  {
    id: 'received',
    title: 'Visitor visa application submitted',
    date: 'August 20, 2026',
    type: 'Confirmation',
    body: 'Your visitor visa application was submitted successfully. Your application number is V123456789. Keep this number for your records.',
    action: 'status'
  }
];

const application = {
  number: 'V123456789',
  uci: '1234-5678',
  type: 'Visitor visa',
  purpose: 'Tourism',
  submitted: 'August 20, 2026',
  lastUpdated: 'September 5, 2026',
  status: 'Review in progress',
  nextActionDue: 'September 18, 2026',
  stages: [
    { id: 'submitted', label: 'Application submitted', state: 'complete', date: 'August 20, 2026', detail: 'We received your application and payment.' },
    { id: 'biometrics', label: 'Biometrics', state: 'complete', date: 'August 29, 2026', detail: 'Your fingerprints and photo were received.' },
    { id: 'eligibility', label: 'Eligibility review', state: 'current', date: 'Started September 4, 2026', detail: 'We are reviewing whether you meet the visitor visa requirements.' },
    { id: 'background', label: 'Background verification', state: 'waiting', date: 'Not started', detail: 'We may verify the information and documents in your application.' },
    { id: 'decision', label: 'Final decision', state: 'waiting', date: 'Not started', detail: 'We will send the decision and any next-step instructions to your account.' },
    { id: 'passport', label: 'Passport submission and visa issuance', state: 'waiting', date: 'Only if approved', detail: 'If approved, online applicants receive instructions to submit the passport used in the application.' },
  ],
};

export function DataProvider({ children }) {
  const messages = initialMessages;
  const [readMessages, setReadMessages] = useState(() => {
    try {
      const read = JSON.parse(sessionStorage.getItem('ircc-read') || '[]');
      return new Set(read);
    } catch {
      return new Set();
    }
  });
  const [attached, setAttached] = useState(() => {
    try {
      return sessionStorage.getItem('ircc-attached') === 'yes';
    } catch {
      return false;
    }
  });
  const [attachmentName, setAttachmentName] = useState(() => {
    try {
      return sessionStorage.getItem('ircc-attachment-name') || '';
    } catch {
      return '';
    }
  });
  const [draftSaved, setDraftSaved] = useState(() => {
    try {
      return sessionStorage.getItem('ircc-draft') === 'yes';
    } catch {
      return false;
    }
  });

  const markRead = useCallback((id) => {
    setReadMessages(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      sessionStorage.setItem('ircc-read', JSON.stringify([...next]));
      return next;
    });
  }, []);

  const attachDocument = (fileName) => {
    setAttached(true);
    setAttachmentName(fileName);
    sessionStorage.setItem('ircc-attached', 'yes');
    sessionStorage.setItem('ircc-attachment-name', fileName);
  };

  const removeDocument = () => {
    setAttached(false);
    setAttachmentName('');
    sessionStorage.setItem('ircc-attached', 'no');
    sessionStorage.removeItem('ircc-attachment-name');
  };

  const saveDraft = () => {
    setDraftSaved(true);
    sessionStorage.setItem('ircc-draft', 'yes');
  };

  return (
    <DataContext.Provider value={{
      messages,
      application,
      readMessages,
      attached,
      attachmentName,
      draftSaved,
      markRead,
      attachDocument,
      removeDocument,
      saveDraft
    }}>
      {children}
    </DataContext.Provider>
  );
}
