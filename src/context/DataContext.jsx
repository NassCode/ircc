import { useCallback, useState } from 'react';
import { DataContext } from './DataContextValue';

const initialMessages = [
  {
    id: 'documents',
    title: 'Request for additional documents',
    date: 'September 3, 2026',
    body: 'We require additional documents to process your application. Open the document checklist to upload the requested documents.',
    action: 'documents'
  },
  {
    id: 'received',
    title: 'Application received',
    date: 'August 20, 2026',
    body: 'Your work permit application has been received and is being processed. You can check the status of your application at any time.',
    action: 'status'
  }
];

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

  const attachDocument = () => {
    setAttached(true);
    sessionStorage.setItem('ircc-attached', 'yes');
  };

  const removeDocument = () => {
    setAttached(false);
    sessionStorage.setItem('ircc-attached', 'no');
  };

  const saveDraft = () => {
    setDraftSaved(true);
    sessionStorage.setItem('ircc-draft', 'yes');
  };

  return (
    <DataContext.Provider value={{
      messages,
      readMessages,
      attached,
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
