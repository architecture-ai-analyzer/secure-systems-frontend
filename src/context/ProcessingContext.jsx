import { useReducer, useContext, useEffect, useCallback, useRef } from 'react';
import { ProcessingContext } from './ProcessingContext';
import { ProjectContext } from './ProjectContext';
import { PROCESSING_STATUS, PROCESSING_ACTIONS } from '../utils/constants';
import { normalizeUploadStatus } from '../utils/helpers';
import { ApiService } from '../services/apiService';

const persistedUploads = JSON.parse(localStorage.getItem('fiap-uploads') || '[]').map((upload) => ({
  ...upload,
  status: normalizeUploadStatus(upload.status) || upload.status
}));
const initialUploads = persistedUploads;

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

    case PROCESSING_ACTIONS.REPLACE_PROJECT_UPLOADS: {
      const { projectId, uploads: incoming } = action.payload;
      const pid = String(projectId);
      const others = state.uploads.filter((u) => String(u.projectId) !== pid);
      newState = {
        ...state,
        uploads: [...others, ...incoming]
      };
      break;
    }

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
  const project = useContext(ProjectContext);
  const projectRef = useRef(project);
  projectRef.current = project;

  const refreshUploadsForProject = useCallback(async () => {
    const p = projectRef.current;
    const pid = p?.currentProjectId;
    if (!pid || p.isLoadingProjects) return;
    try {
      const rows = await ApiService.listUploadsByProject(pid);
      const list = Array.isArray(rows) ? rows : [];
      const incoming = list.map((row) => {
        const id = String(row.id ?? '');
        const projectId = row.projectId != null ? String(row.projectId) : null;
        const proj = projectId && p.getProjectById ? p.getProjectById(projectId) : null;
        return {
          id,
          fileName: row.filename,
          fileSize: row.sizeBytes ?? 0,
          projectId,
          projectName: proj?.name ?? null,
          uploaderId: row.uploaderId ?? null,
          status: normalizeUploadStatus(row.status) || PROCESSING_STATUS.RECEBIDO,
          createdAt: row.createdAt || new Date().toISOString(),
          updatedAt: row.completedAt || row.createdAt || new Date().toISOString()
        };
      });
      dispatch({
        type: PROCESSING_ACTIONS.REPLACE_PROJECT_UPLOADS,
        payload: { projectId: pid, uploads: incoming }
      });
    } catch (e) {
      console.error('refreshUploadsForProject:', e);
    }
  }, []);

  useEffect(() => {
    refreshUploadsForProject();
  }, [
    refreshUploadsForProject,
    project?.currentProjectId,
    project?.isLoadingProjects,
    project?.projects?.length
  ]);

  const addUpload = (uploadPayload) => {
    const now = new Date().toISOString();
    const upload = {
      id: uploadPayload.id,
      fileName: uploadPayload.fileName,
      fileSize: uploadPayload.fileSize,
      projectId: uploadPayload.projectId || null,
      projectName: uploadPayload.projectName || null,
      uploaderId: uploadPayload.uploaderId || null,
      status: normalizeUploadStatus(uploadPayload.status) || PROCESSING_STATUS.RECEBIDO,
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
      const frontendStatus = normalizeUploadStatus(uploadData.status) || PROCESSING_STATUS.RECEBIDO;

      const resolvedId = uploadData.id ?? uploadData.uploadId ?? uploadId;

      return {
        ...uploadData,
        id: String(resolvedId),
        uploadId: String(resolvedId),
        status: frontendStatus,
        fileName: uploadData.filename,
        fileSize: uploadData.sizeBytes,
        projectId: uploadData.projectId || null,
        uploaderId: uploadData.uploaderId || null
      };
    } catch (error) {
      console.error('Error fetching real status:', error);
      throw error;
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
    getRealStatus,
    refreshUploadsForProject
  };

  return (
    <ProcessingContext.Provider value={value}>
      {children}
    </ProcessingContext.Provider>
  );
}