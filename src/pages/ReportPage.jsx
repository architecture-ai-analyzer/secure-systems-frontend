import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProcessing } from '../hooks/useProcessing';
import { useProject } from '../hooks/useProject';
import ProjectSelector from '../components/ProjectSelector';
import { PROCESSING_STATUS } from '../utils/constants';
// TODO: BACKEND_INTEGRATION - Substituído MockApiService por reportApiService para integração com backend
// import { MockApiService } from '../services/mockApiService';
import reportApiService from '../services/reportApiService.js';
import { formatDate, getRiskLevelColor, getPriorityColor } from '../utils/helpers';

const ReportPage = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const { uploads, getUploadById } = useProcessing();
  const { currentProject, currentProjectId } = useProject();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const upload = uploadId ? getUploadById(uploadId) : null;
  const isUploadInSelectedProject = !currentProjectId || upload?.projectId === currentProjectId;

  const getLatestReportUploadId = (projectId) => {
    const scopedUploads = projectId
      ? uploads.filter((item) => item.projectId === projectId)
      : uploads;

    return [...scopedUploads]
      .filter((item) => item.status === PROCESSING_STATUS.ANALISADO)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]?.id;
  };

  const handleProjectChange = (projectId) => {
    const nextUploadId = getLatestReportUploadId(projectId);
    if (nextUploadId) {
      navigate(`/reports/${nextUploadId}`);
      return;
    }

    navigate('/reports');
  };

  useEffect(() => {
    const generateReport = async () => {
      if (!upload || !isUploadInSelectedProject || upload.status !== PROCESSING_STATUS.ANALISADO) {
        setError('Relatório não disponível ou arquivo ainda em processamento');
        setLoading(false);
        return;
      }

      try {
        // TODO: BACKEND_INTEGRATION - Substituído MockApiService por reportApiService
        // const reportData = await MockApiService.generateReport(upload.id, upload.fileName);
        const reportData = await reportApiService.getReport(upload.id);
        setReport(reportData);
      } catch (err) {
        setError('Erro ao gerar relatório');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [upload, isUploadInSelectedProject]);

  const handleDownloadReport = () => {
    if (upload?.id) {
      reportApiService.downloadReport(upload.id);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-md mb-6">
          <ProjectSelector
            includeAllOption
            label="Projeto dos relatórios"
            onChange={handleProjectChange}
          />
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fiap-blue mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Gerando relatório...</p>
            <p className="text-sm text-gray-500">Aguarde enquanto compilamos a análise</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-md mb-6">
          <ProjectSelector
            includeAllOption
            label="Projeto dos relatórios"
            onChange={handleProjectChange}
          />
        </div>
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Relatório Indisponível</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/processing" className="btn-secondary">
              Voltar à Lista
            </Link>
            <Link to="/upload" className="btn-primary">
              Novo Upload
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-md mb-6">
        <ProjectSelector
          includeAllOption
          label="Projeto dos relatórios"
          onChange={handleProjectChange}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Relatório de Análise Técnica
            </h1>
            <p className="text-sm text-gray-500">
              Gerado em: {formatDate(report.generatedAt)}
            </p>
            {/* NOVA LINHA */}
            <p className="text-sm text-gray-500 mt-1">
              Template Aplicado: <span className="font-semibold text-fiap-blue uppercase">{report.templateId || 'PADRÃO'}</span>
            </p>
            <p className="text-gray-600">
              Análise completa do arquivo: <strong>{upload.fileName}</strong>
            </p>
            {currentProject && (
              <p className="text-sm text-gray-500">
                Projeto: {currentProject.name}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Gerado em: {formatDate(report.generatedAt)}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/processing" className="btn-secondary">
              ← Voltar à Lista
            </Link>
            <button onClick={handleDownloadReport} className="btn-primary">
              📥 Download do Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-fiap-blue mb-2">{report.summary.totalComponents}</div>
          <div className="text-sm text-gray-600">Componentes<br/>Detectados</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{report.summary.securityScore}</div>
          <div className="text-sm text-gray-600">Score de<br/>Segurança</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{report.summary.performanceScore}</div>
          <div className="text-sm text-gray-600">Score de<br/>Performance</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{report.summary.architectureScore}</div>
          <div className="text-sm text-gray-600">Score<br/>Arquitetural</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Detected Components */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">🏗️ Componentes Detectados</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {report.detectedComponents.map((component) => (
                <div key={component.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{component.name}</h3>
                    <p className="text-sm text-gray-600">{component.type}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(component.criticality)}`}>
                      {component.criticality}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{component.connectionsCount || component.connections?.length || 0} conexões</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Analysis */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">🔒 Análise de Segurança</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Risco Geral</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(report.securityAnalysis.overallRisk)}`}>
                  {report.securityAnalysis.overallRisk}
                </span>
              </div>
              <p className="text-sm text-gray-500">{report.securityAnalysis.risksFound} riscos identificados</p>
            </div>

            <div className="space-y-4">
              {report.securityAnalysis.risks.map((risk, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{risk.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(risk.level)}`}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    💡 {risk.recommendation}
                  </p>
                </div>
              ))}
            </div>

            {/* Compliance */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Conformidade</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">LGPD</span>
                  <span className={`text-sm font-medium ${report.securityAnalysis.compliance.lgpd ? 'text-green-600' : 'text-red-600'}`}>
                    {report.securityAnalysis.compliance.lgpd ? '✅ Conforme' : '❌ Não conforme'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ISO 27001</span>
                  <span className={`text-sm font-medium ${report.securityAnalysis.compliance.iso27001 ? 'text-green-600' : 'text-red-600'}`}>
                    {report.securityAnalysis.compliance.iso27001 ? '✅ Conforme' : '❌ Não conforme'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">OWASP</span>
                  <span className={`text-sm font-medium ${report.securityAnalysis.compliance.owasp ? 'text-green-600' : 'text-red-600'}`}>
                    {report.securityAnalysis.compliance.owasp ? '✅ Conforme' : '❌ Não conforme'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Analysis */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">📐 Análise Arquitetural</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Patterns */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Padrões Detectados</h4>
                <div className="space-y-3">
                  {report.architectureAnalysis.patterns.map((pattern, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${pattern.detected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-800">{pattern.pattern}</h5>
                        <span className={`text-sm font-medium ${pattern.detected ? 'text-green-600' : 'text-yellow-600'}`}>
                          {pattern.detected ? '✅ Detectado' : '⚠️ Ausente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                      {pattern.benefits && (
                        <div className="text-sm text-gray-500">
                          <strong>Benefícios:</strong> {Array.isArray(pattern.benefits) ? pattern.benefits.join(', ') : pattern.benefits}
                        </div>
                      )}
                      {pattern.recommendation && (
                        <div className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded mt-2">
                          💡 {pattern.recommendation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Complexidade</h4>
                  <div className={`px-3 py-2 rounded text-center font-medium ${getRiskLevelColor(report.architectureAnalysis.complexity)}`}>
                    {report.architectureAnalysis.complexity}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Manutenibilidade</h4>
                  <div className="px-3 py-2 rounded text-center font-medium bg-blue-100 text-blue-800">
                    {report.architectureAnalysis.maintainability}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">⚡ Análise de Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Metrics */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Métricas</h4>
                <div className="space-y-3">
                  {report.performanceAnalysis.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-800">{metric.metric}</h5>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded font-medium text-sm ${
                          metric.status === 'good' ? 'bg-green-100 text-green-800' :
                          metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {metric.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottlenecks */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Gargalos Identificados</h4>
                <div className="space-y-2">
                  {report.performanceAnalysis.bottlenecks.map((bottleneck, index) => (
                    <div key={index} className="flex items-center p-2 bg-yellow-50 rounded">
                      <span className="text-yellow-600 mr-2">⚠️</span>
                      <span className="text-sm text-gray-700">{bottleneck}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Capacidade</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uso Atual:</span>
                    <span className="text-sm font-medium text-gray-800">{report.performanceAnalysis.capacity.current}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uso Recomendado:</span>
                    <span className="text-sm font-medium text-gray-800">{report.performanceAnalysis.capacity.recommended}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacidade Máxima:</span>
                    <span className="text-sm font-medium text-gray-800">{report.performanceAnalysis.capacity.maxCapacity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">💡 Recomendações</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-6">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)} bg-opacity-20`}>
                        {rec.priority} Prioridade
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                        {rec.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{rec.title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{rec.description}</p>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-500">Esforço:</span>
                    <span className="ml-1 font-medium text-gray-700">{rec.effort}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Impacto:</span>
                    <span className="ml-1 font-medium text-green-600">{rec.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;