// Estados do ciclo de vida do upload — mesmos nomes/valores que o enum UploadStatus no backend (@JsonValue).
export const PROCESSING_STATUS = {
  RECEBIDO: 'RECEBIDO',
  EM_PROCESSAMENTO: 'EM_PROCESSAMENTO',
  ANALISADO: 'ANALISADO',
  ERRO: 'ERRO'
};

/** Rótulos para exibição na UI (chave = string canônica do backend) */
export const PROCESSING_STATUS_LABELS = {
  [PROCESSING_STATUS.RECEBIDO]: 'Recebido',
  [PROCESSING_STATUS.EM_PROCESSAMENTO]: 'Em processamento',
  [PROCESSING_STATUS.ANALISADO]: 'Analisado',
  [PROCESSING_STATUS.ERRO]: 'Erro'
};

/** Progresso determinístico por etapa (o backend não envia %) */
export const PROCESSING_STATUS_PROGRESS = {
  [PROCESSING_STATUS.RECEBIDO]: 25,
  [PROCESSING_STATUS.EM_PROCESSAMENTO]: 65,
  [PROCESSING_STATUS.ANALISADO]: 100,
  [PROCESSING_STATUS.ERRO]: 0
};

// Action types
export const PROCESSING_ACTIONS = {
  ADD_UPLOAD: 'ADD_UPLOAD',
  UPDATE_STATUS: 'UPDATE_STATUS',
  SET_CURRENT_UPLOAD: 'SET_CURRENT_UPLOAD',
  CLEAR_CURRENT_UPLOAD: 'CLEAR_CURRENT_UPLOAD',
  /** Substitui uploads locais de um projeto pelos retornados do upload-service */
  REPLACE_PROJECT_UPLOADS: 'REPLACE_PROJECT_UPLOADS'
};

export const PROJECT_ACTIONS = {
  SET_PROJECTS: 'SET_PROJECTS',
  ADD_PROJECT: 'ADD_PROJECT',
  SELECT_PROJECT: 'SELECT_PROJECT'
};
