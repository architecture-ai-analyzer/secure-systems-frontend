import { MockApiService } from './mockApiService.js';
import { adaptReportResponse } from './reportResponseAdapter.js';

const REPORT_API_BASE = (import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8081').replace(/\/$/, '');
/** Só usa mock quando explicitamente true */
const USE_MOCK = import.meta.env.VITE_REPORTS_USE_MOCK === 'true';

function reportUrl(path) {
  return `${REPORT_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

class ReportApiService {
  async uploadDiagram(uploadId, file) {
    if (USE_MOCK) {
      console.log('Using MOCK for upload');
      return MockApiService.generateReport(uploadId, file?.name);
    }

    const body = {
      analysis: { components: [], risks: [], recommendations: [] },
      metadata: {
        modelVersion: 'secure-systems-frontend',
        userId: 'default-user',
        originalFilename: file?.name || null
      }
    };

    const response = await fetch(reportUrl(`/api/reports/${uploadId}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error('Report generation request failed');
    }

    const data = await response.json();
    return adaptReportResponse(data, uploadId, file?.name) ?? data;
  }

  async getProcessingStatus(uploadId) {
    if (USE_MOCK) {
      return MockApiService.getProcessingStatus(uploadId);
    }

    const response = await fetch(reportUrl(`/api/reports/${uploadId}/status`));

    if (!response.ok) {
      throw new Error('Status fetch failed');
    }

    return response.json();
  }

  async getReport(uploadId, fileName) {
    if (USE_MOCK) {
      return MockApiService.generateReport(uploadId, fileName);
    }

    const response = await fetch(reportUrl(`/api/reports/${uploadId}`));

    if (!response.ok) {
      throw new Error('Report fetch failed');
    }

    const data = await response.json();
    return adaptReportResponse(data, uploadId, fileName) ?? data;
  }

  async listReports(page = 0, size = 10) {
    if (USE_MOCK) {
      return MockApiService.listReports(page, size);
    }

    const response = await fetch(reportUrl(`/api/reports?page=${page}&size=${size}`));

    if (!response.ok) {
      throw new Error('Reports list failed');
    }

    return response.json();
  }

  async downloadReport(uploadId) {
    if (USE_MOCK) {
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

    const response = await fetch(reportUrl(`/api/reports/${uploadId}/download`));

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
  }
}

export default new ReportApiService();
