// Processing status constants
export const PROCESSING_STATUS = {
  RECEBIDO: 'Recebido',
  EM_PROCESSAMENTO: 'Em processamento',
  ANALISADO: 'Analisado',
  ERRO: 'Erro'
};

// Action types
export const PROCESSING_ACTIONS = {
  ADD_UPLOAD: 'ADD_UPLOAD',
  UPDATE_STATUS: 'UPDATE_STATUS',
  SET_CURRENT_UPLOAD: 'SET_CURRENT_UPLOAD',
  CLEAR_CURRENT_UPLOAD: 'CLEAR_CURRENT_UPLOAD'
};