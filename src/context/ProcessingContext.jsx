import { useReducer } from 'react';
import { ProcessingContext } from './ProcessingContext';
import { PROCESSING_STATUS, PROCESSING_ACTIONS } from '../utils/constants';
import { MockApiService } from '../services/mockApiService';
import { ApiService } from '../services/apiService';

function mapBackendStatusToFrontendStatus(status) {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case 'pending':
      return PROCESSING_STATUS.RECEBIDO;
    case 'completed':
      return PROCESSING_STATUS.ANALISADO;
    case 'failed':
      return PROCESSING_STATUS.ERRO;
    default:
      return PROCESSING_STATUS.RECEBIDO;
  }
}

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

  const addUpload = (uploadPayload) => {
    const now = new Date().toISOString();
    const upload = {
      id: uploadPayload.id,
      fileName: uploadPayload.fileName,
      fileSize: uploadPayload.fileSize,
      status: uploadPayload.status || PROCESSING_STATUS.RECEBIDO,
      createdAt: uploadPayload.createdAt || now,
      updatedAt: uploadPayload.updatedAt || now
    };
    
    dispatch({ type: PROCESSING_ACTIONS.ADD_UPLOAD, payload: upload });

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

  const getRealStatus = async (uploadId) => {
    try {
      const uploadData = await ApiService.getUpload(uploadId);
      const frontendStatus = mapBackendStatusToFrontendStatus(uploadData.status);

      return {
        ...uploadData,
        status: frontendStatus,
        fileName: uploadData.filename,
        fileSize: uploadData.sizeBytes
      };
    } catch (error) {
      console.error('Error fetching real status:', error);
      // Fallback to mock if real API fails
      return MockApiService.getProcessingStatus(uploadId);
    }
  };

  const value = {
    uploads: state.uploads,
    currentUpload: state.currentUpload,
    addUpload,
    updateStatus,
    setCurrentUpload,
    clearCurrentUpload,
    getUploadById,
    getRealStatus
  };

  return (
    <ProcessingContext.Provider value={value}>
      {children}
    </ProcessingContext.Provider>
  );
}