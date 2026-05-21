/**
 * Garante o formato esperado por ReportPage.jsx a partir do JSON do report-service.
 */
export function adaptReportResponse(api, uploadId, fileName) {
  if (!api || typeof api !== 'object') {
    return null;
  }

  const summary = api.summary || {};
  const sec = api.securityAnalysis || {};
  const arch = api.architectureAnalysis || {};
  const perf = api.performanceAnalysis || {};

  return {
    ...api,
    id: uploadId,
    fileName: fileName || api.fileName,
    generatedAt: api.generatedAt,
    summary: {
      totalComponents: summary.totalComponents ?? 0,
      securityScore: summary.securityScore ?? 0,
      performanceScore: summary.performanceScore ?? 0,
      architectureScore: summary.architectureScore ?? 0
    },
    detectedComponents: Array.isArray(api.detectedComponents) ? api.detectedComponents : [],
    securityAnalysis: {
      overallRisk: sec.overallRisk ?? 'Médio',
      risksFound: typeof sec.risksFound === 'number' ? sec.risksFound : 0,
      risks: Array.isArray(sec.risks) ? sec.risks : [],
      compliance: sec.compliance || { lgpd: false, iso27001: false, owasp: false }
    },
    architectureAnalysis: {
      patterns: Array.isArray(arch.patterns) ? arch.patterns : [],
      complexity: arch.complexity ?? '—',
      maintainability: arch.maintainability ?? '—',
      scalability: arch.scalability
    },
    performanceAnalysis: {
      metrics: Array.isArray(perf.metrics) ? perf.metrics : [],
      bottlenecks: Array.isArray(perf.bottlenecks) ? perf.bottlenecks : [],
      capacity: perf.capacity || { current: 0, recommended: 0, maxCapacity: 0 }
    },
    recommendations: Array.isArray(api.recommendations) ? api.recommendations : []
  };
}
