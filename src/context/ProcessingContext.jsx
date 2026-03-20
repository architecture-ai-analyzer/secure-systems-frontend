import { useReducer } from 'react';
import { ProcessingContext } from './ProcessingContext';
import { PROCESSING_STATUS, PROCESSING_ACTIONS } from '../utils/constants';
import { MockApiService } from '../services/mockApiService';

const persistedUploads = JSON.parse(localStorage.getItem('fiap-uploads') || '[]');
const initialUploads = persistedUploads.length > 0
  ? persistedUploads
  : MockApiService.getCompletedUploadsMock();

// Initial state
const initialState = {
  uploads: initialUploads,
  currentUpload: null
};

// Reducer
function processingReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case PROCESSING_ACTIONS.ADD_UPLOAD:
      newState = {
        ...state,
        uploads: [...state.uploads, action.payload]
      };
      break;
      
    case PROCESSING_ACTIONS.UPDATE_STATUS:
      newState = {
        ...state,
        uploads: state.uploads.map(upload =>
          upload.id === action.payload.id
            ? { ...upload, status: action.payload.status, updatedAt: new Date().toISOString() }
            : upload
        )
      };
      break;
      
    case PROCESSING_ACTIONS.SET_CURRENT_UPLOAD:
      newState = {
        ...state,
        currentUpload: action.payload
      };
      break;
      
    case PROCESSING_ACTIONS.CLEAR_CURRENT_UPLOAD:
      newState = {
        ...state,
        currentUpload: null
      };
      break;
      
    default:
      return state;
  }
  
  // Persist to localStorage
  localStorage.setItem('fiap-uploads', JSON.stringify(newState.uploads));
  return newState;
}

// Provider component
export function ProcessingProvider({ children }) {
  const [state, dispatch] = useReducer(processingReducer, initialState);

  const addUpload = (file) => {
    const upload = {
      id: Date.now().toString(),
      fileName: file.name,
      fileSize: file.size,
      status: PROCESSING_STATUS.RECEBIDO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      file: file
    };
    
    dispatch({ type: PROCESSING_ACTIONS.ADD_UPLOAD, payload: upload });
    
    // Simulate processing progression
    setTimeout(() => {
      dispatch({ 
        type: PROCESSING_ACTIONS.UPDATE_STATUS, 
        payload: { id: upload.id, status: PROCESSING_STATUS.EM_PROCESSAMENTO }
      });
      
      // Random completion time between 2-4 minutes for demo
      const processingTime = Math.random() * 120000 + 120000; // 2-4 minutes
      setTimeout(() => {
        // 10% chance of error for realistic simulation
        const hasError = Math.random() < 0.1;
        const finalStatus = hasError ? PROCESSING_STATUS.ERRO : PROCESSING_STATUS.ANALISADO;
        
        dispatch({ 
          type: PROCESSING_ACTIONS.UPDATE_STATUS, 
          payload: { id: upload.id, status: finalStatus }
        });
      }, processingTime);
      
    }, 30000); // Start processing after 30 seconds
    
    return upload.id;
  };

  const updateStatus = (id, status) => {
    dispatch({ type: PROCESSING_ACTIONS.UPDATE_STATUS, payload: { id, status } });
  };

  const setCurrentUpload = (upload) => {
    dispatch({ type: PROCESSING_ACTIONS.SET_CURRENT_UPLOAD, payload: upload });
  };

  const clearCurrentUpload = () => {
    dispatch({ type: PROCESSING_ACTIONS.CLEAR_CURRENT_UPLOAD });
  };

  const getUploadById = (id) => {
    return state.uploads.find(upload => upload.id === id);
  };

  const value = {
    uploads: state.uploads,
    currentUpload: state.currentUpload,
    addUpload,
    updateStatus,
    setCurrentUpload,
    clearCurrentUpload,
    getUploadById
  };

  return (
    <ProcessingContext.Provider value={value}>
      {children}
    </ProcessingContext.Provider>
  );
}