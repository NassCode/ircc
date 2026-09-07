import { useContext } from 'react';
import { DataContext } from './DataContextValue';

export function useData() {
  return useContext(DataContext);
}
