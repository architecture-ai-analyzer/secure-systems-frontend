// Utility functions for the FIAP Secure Systems application

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

export const validatePdfFile = (file) => {
  const errors = [];
  
  // Check file type
  if (file.type !== 'application/pdf') {
    errors.push('Apenas arquivos PDF são aceitos');
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

export const getStatusIcon = (status) => {
  const icons = {
    'Recebido': '🕐',
    'Em processamento': '⚙️',
    'Analisado': '✅',
    'Erro': '❌'
  };
  
  return icons[status] || '❓';
};

export const getStatusColor = (status) => {
  const colors = {
    'Recebido': 'status-recebido',
    'Em processamento': 'status-processando',
    'Analisado': 'status-analisado',
    'Erro': 'status-erro'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
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