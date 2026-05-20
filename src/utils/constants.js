// Upload lifecycle statuses — values match backend UploadStatus (@JsonValue)
export const PROCESSING_STATUS = {
  RECEIVED: 'RECEIVED',
  PROCESSING: 'PROCESSING',
  ANALYZED: 'ANALYZED',
  ERROR: 'ERROR'
};

/** Portuguese labels for UI display only */
export const PROCESSING_STATUS_LABELS = {
  [PROCESSING_STATUS.RECEIVED]: 'Recebido',
  [PROCESSING_STATUS.PROCESSING]: 'Em processamento',
  [PROCESSING_STATUS.ANALYZED]: 'Analisado',
  [PROCESSING_STATUS.ERROR]: 'Erro'
};

/** Deterministic progress per lifecycle stage (backend does not send progress %) */
export const PROCESSING_STATUS_PROGRESS = {
  [PROCESSING_STATUS.RECEIVED]: 25,
  [PROCESSING_STATUS.PROCESSING]: 65,
  [PROCESSING_STATUS.ANALYZED]: 100,
  [PROCESSING_STATUS.ERROR]: 0
};

// Action types
export const PROCESSING_ACTIONS = {
  ADD_UPLOAD: 'ADD_UPLOAD',
  UPDATE_STATUS: 'UPDATE_STATUS',
  SET_CURRENT_UPLOAD: 'SET_CURRENT_UPLOAD',
  CLEAR_CURRENT_UPLOAD: 'CLEAR_CURRENT_UPLOAD'
};

export const PROJECT_ACTIONS = {
  SET_PROJECTS: 'SET_PROJECTS',
  ADD_PROJECT: 'ADD_PROJECT',
  SELECT_PROJECT: 'SELECT_PROJECT'
};
