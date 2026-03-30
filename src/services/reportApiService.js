// API Service com fallback para mock
// Pode alternar entre backend real e mock
const USE_MOCK = false; // Mude para true para usar mock

import { MockApiService } from './mockApiService.js';

class ReportApiService {
  
  // Upload de diagrama e criar relatório
  async uploadDiagram(uploadId, file) {
    if (USE_MOCK) {
      // Mock: simula upload e cria relatório mock
      console.log('Using MOCK for upload');
      return MockApiService.generateReport(uploadId);
    }

    // Backend real
    console.log('Calling REAL API for upload:', `http://localhost:8081/api/reports/${uploadId}`);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`http://localhost:8081/api/reports/${uploadId}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return await response.json();
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

    console.log('Calling REAL API for status:', `http://localhost:8081/api/reports/${uploadId}/status`);
    try {
      const response = await fetch(`http://localhost:8081/api/reports/${uploadId}/status`);
      
      if (!response.ok) {
        throw new Error('Status fetch failed');
      }
      console.log('Real API response:', response.status);
      return await response.json();
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
      const response = await fetch(`http://localhost:8081/api/reports/${uploadId}`);
      
      if (!response.ok) {
        throw new Error('Report fetch failed');
      }
      
      return await response.json();
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
      const response = await fetch(`http://localhost:8081/api/reports?page=${page}&size=${size}`);
      
      if (!response.ok) {
        throw new Error('Reports list failed');
      }
      
      return await response.json();
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
      const response = await fetch(`http://localhost:8081/api/reports/${uploadId}/download`);
      
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
