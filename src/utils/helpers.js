// Utility functions for the FIAP Secure Systems application

import {
  PROCESSING_STATUS,
  PROCESSING_STATUS_LABELS,
  PROCESSING_STATUS_PROGRESS
} from './constants';

const LEGACY_STATUS_MAP = {
  RECEBIDO: PROCESSING_STATUS.RECEIVED,
  EM_PROCESSAMENTO: PROCESSING_STATUS.PROCESSING,
  ANALISADO: PROCESSING_STATUS.ANALYZED,
  ERRO: PROCESSING_STATUS.ERROR
};

const normalizeKey = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');

/** Maps backend or legacy status strings to PROCESSING_STATUS values */
export const normalizeUploadStatus = (status) => {
  if (!status) return null;

  const key = normalizeKey(status);
  if (Object.values(PROCESSING_STATUS).includes(key)) {
    return key;
  }
  return LEGACY_STATUS_MAP[key] || null;
};

export const getStatusLabel = (status) => {
  const normalized = normalizeUploadStatus(status);
  return (normalized && PROCESSING_STATUS_LABELS[normalized]) || status;
};

export const getUploadProgressPercentage = (status) => {
  const normalized = normalizeUploadStatus(status);
  if (!normalized) return 0;
  return PROCESSING_STATUS_PROGRESS[normalized] ?? 0;
};

export const isRealStatusForUpload = (realStatus, uploadId) => {
  if (!realStatus || !uploadId) return false;
  const realId = realStatus.id ?? realStatus.uploadId;
  return realId != null && String(realId) === String(uploadId);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const validateUploadFile = (file) => {
  const errors = [];

  const allowedMimeTypes = new Set([
    'application/pdf',
    'image/png',
    'image/jpg',
    'image/jpeg'
  ]);

  const allowedExtensions = new Set(['pdf', 'png', 'jpg', 'jpeg']);

  const fileName = file?.name || '';
  const extension = fileName.includes('.')
    ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
    : '';
  
  // Check file type
  if (!allowedMimeTypes.has(file.type) && !allowedExtensions.has(extension)) {
    errors.push('Apenas arquivos PDF, PNG, JPG e JPEG são aceitos');
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push('O arquivo deve ter no máximo 10MB');
  }
  
  // Check if file exists
  if (!file.name) {
    errors.push('Nome do arquivo é obrigatório');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Compatibilidade com chamadas existentes no projeto.
export const validatePdfFile = validateUploadFile;

export const getStatusIcon = (status) => {
  const normalized = normalizeUploadStatus(status);
  const icons = {
    [PROCESSING_STATUS.RECEIVED]: '🕐',
    [PROCESSING_STATUS.PROCESSING]: '⚙️',
    [PROCESSING_STATUS.ANALYZED]: '✅',
    [PROCESSING_STATUS.ERROR]: '❌'
  };

  return icons[normalized] || '❓';
};

export const getStatusColor = (status) => {
  const normalized = normalizeUploadStatus(status);
  const colors = {
    [PROCESSING_STATUS.RECEIVED]: 'status-recebido',
    [PROCESSING_STATUS.PROCESSING]: 'status-processando',
    [PROCESSING_STATUS.ANALYZED]: 'status-analisado',
    [PROCESSING_STATUS.ERROR]: 'status-erro'
  };

  return colors[normalized] || 'bg-gray-100 text-gray-800';
};

export const getRiskLevelColor = (level) => {
  const colors = {
    'Alto': 'text-red-600 bg-red-100',
    'Médio': 'text-yellow-600 bg-yellow-100',
    'Baixo': 'text-green-600 bg-green-100'
  };
  
  return colors[level] || 'text-gray-600 bg-gray-100';
};

export const getPriorityColor = (priority) => {
  const colors = {
    'Alta': 'text-red-600',
    'Média': 'text-yellow-600',
    'Baixa': 'text-green-600'
  };
  
  return colors[priority] || 'text-gray-600';
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const downloadReport = (reportData, fileName) => {
  const jsonString = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio_${fileName}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const truncateFileName = (fileName, maxLength = 30) => {
  if (fileName.length <= maxLength) return fileName;
  
  const extension = fileName.split('.').pop();
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4);
  
  return `${truncatedName}...${extension}`;
};