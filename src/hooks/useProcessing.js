import { useContext } from 'react';
import { ProcessingContext } from '../context/ProcessingContext';

// Custom hook
export function useProcessing() {
  const context = useContext(ProcessingContext);
  if (!context) {
    throw new Error('useProcessing must be used within a ProcessingProvider');
  }
  return context;
}