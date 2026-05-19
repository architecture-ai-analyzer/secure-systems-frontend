// API Service com fallback para mock
// Pode alternar entre backend real e mock
const USE_MOCK = (import.meta.env.VITE_REPORTS_USE_MOCK || 'true') === 'true';
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

import { MockApiService } from './mockApiService.js';

function mapErrorMessage(status, body) {
  if (status === 404) return 'Recurso não encontrado.';
  if (status === 400) return 'Requisição inválida.';
  if (status >= 500) return 'Falha interna no servidor.';
  return body?.message || 'Falha na comunicação com a API.';
}

async function request(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = hasBody && typeof FormData !== 'undefined' && options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    },
    ...options
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(mapErrorMessage(response.status, body));
  }

  return body;
}

class ReportApiService {
  
  // Upload de diagrama e criar relatório
  async uploadDiagram(uploadId, file) {
    if (USE_MOCK) {
      // Mock: simula upload e cria relatório mock
      console.log('Using MOCK for upload');
      return MockApiService.generateReport(uploadId);
    }

    // Backend real
    console.log('Calling REAL API for upload:', `${API_BASE_URL}/api/reports/${uploadId}`);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      return await request(`/api/reports/${uploadId}`, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Upload error:', error);
      // Fallback para mock se backend falhar
      console.log('Fallback to mock for upload');
      return MockApiService.generateReport(uploadId);
    }
  }

  // Buscar status do processamento
  async getProcessingStatus(uploadId) {
    if (USE_MOCK) {
      console.log('Using MOCK for status');
      return MockApiService.getProcessingStatus(uploadId);
    }

    console.log('Calling REAL API for status:', `${API_BASE_URL}/api/reports/${uploadId}/status`);
    try {
      return await request(`/api/reports/${uploadId}/status`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Status error:', error);
      // Fallback para mock
      console.log('Fallback to mock for status');
      return MockApiService.getProcessingStatus(uploadId);
    }
  }

  // Buscar relatório completo
  async getReport(uploadId) {
    if (USE_MOCK) {
      return MockApiService.generateReport(uploadId);
    }

    try {
      return await request(`/api/reports/${uploadId}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Report error:', error);
      // Fallback para mock
      return MockApiService.generateReport(uploadId);
    }
  }

  // Listar todos os relatórios com paginação
  async listReports(page = 0, size = 10) {
    if (USE_MOCK) {
      return MockApiService.listReports(page, size);
    }

    try {
      return await request(`/api/reports?page=${page}&size=${size}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('List error:', error);
      // Fallback para mock
      return MockApiService.listReports(page, size);
    }
  }

  // Download PDF do relatório
  async downloadReport(uploadId) {
    if (USE_MOCK) {
      // Mock: gera PDF simulado
      const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${uploadId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${uploadId}/download`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${uploadId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback para mock
      const blob = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${uploadId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }
}

export default new ReportApiService();
