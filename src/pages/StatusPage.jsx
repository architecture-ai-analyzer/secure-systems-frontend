import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProcessing } from '../hooks/useProcessing';
import { useProject } from '../hooks/useProject';
import ProjectSelector from '../components/ProjectSelector';
import { PROCESSING_STATUS } from '../utils/constants';
import {
  formatDate,
  formatFileSize,
  getStatusIcon,
  getStatusColor,
  getStatusLabel,
  getUploadProgressPercentage,
  isRealStatusForUpload
} from '../utils/helpers';

const StatusPage = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const { uploads, getUploadById, getRealStatus, updateStatus } = useProcessing();
  const { currentProject, currentProjectId, getProjectById } = useProject();
  const [refreshing, setRefreshing] = useState(false);
  const [realStatus, setRealStatus] = useState(null);
  
  const upload = uploadId ? getUploadById(uploadId) : null;
  const project = upload?.projectId ? getProjectById(upload.projectId) : null;
  const isUploadInSelectedProject = !currentProjectId || upload?.projectId === currentProjectId;

  const getLatestStatusUploadId = (projectId) => {
    const scopedUploads = projectId
      ? uploads.filter((item) => item.projectId === projectId)
      : uploads;

    return [...scopedUploads]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]?.id;
  };

  const handleProjectChange = (projectId) => {
    const nextUploadId = getLatestStatusUploadId(projectId);
    if (nextUploadId) {
      navigate(`/status/${nextUploadId}`);
      return;
    }

    navigate('/status');
  };

  const currentStatus = isRealStatusForUpload(realStatus, uploadId)
    ? realStatus.status
    : upload?.status;

  // Clear stale API data when navigating between uploads
  useEffect(() => {
    setRealStatus(null);
  }, [uploadId]);

  // Fetch real status on mount and when uploadId changes
  useEffect(() => {
    const fetchRealStatus = async () => {
      if (uploadId && isUploadInSelectedProject) {
        try {
          const status = await getRealStatus(uploadId);
          setRealStatus(status);
          
          // Update local status if backend status is different
          if (status.status && upload && status.status !== upload.status) {
            updateStatus(uploadId, status.status);
          }
        } catch (error) {
          console.error('Failed to fetch real status:', error);
        }
      }
    };
    fetchRealStatus();
  }, [uploadId, getRealStatus, isUploadInSelectedProject, upload, updateStatus]);

  // Auto-refresh for processing items
  useEffect(() => {
    if (
      isUploadInSelectedProject &&
      (
        upload?.status === PROCESSING_STATUS.RECEIVED ||
        upload?.status === PROCESSING_STATUS.PROCESSING
      )
    ) {
      const interval = setInterval(() => {
        // Refresh real status
        const fetchStatus = async () => {
          try {
            const status = await getRealStatus(uploadId);
            setRealStatus(status);
            
            // Update local status if backend status changed
            if (status.status && upload && status.status !== upload.status) {
              updateStatus(uploadId, status.status);
            }
          } catch (error) {
            console.error('Failed to refresh status:', error);
          }
        };
        fetchStatus();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [upload?.status, uploadId, getRealStatus, isUploadInSelectedProject, upload, updateStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const status = await getRealStatus(uploadId);
      setRealStatus(status);
      
      // Update local status if backend status changed
      if (status.status && upload && status.status !== upload.status) {
        updateStatus(uploadId, status.status);
      }
    } catch (error) {
      console.error('Failed to refresh status:', error);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getProcessingSteps = () => {
    const status = currentStatus;
    const isCompleted = status === PROCESSING_STATUS.ANALYZED;
    const isError = status === PROCESSING_STATUS.ERROR;
    const isProcessing = status === PROCESSING_STATUS.PROCESSING;
    
    const steps = [
      {
        id: 1,
        title: 'Recebimento do Arquivo',
        description: 'Arquivo PDF recebido e validado',
        status: isCompleted || isError ? 'completed' : 
                status === PROCESSING_STATUS.RECEIVED ? 'current' : 'pending'
      },
      {
        id: 2,
        title: 'Análise de Componentes',
        description: realStatus?.currentStep || (isCompleted ? 'Análise concluída' : 'Identificando elementos da arquitetura'),
        status: isCompleted ? 'completed' : 
                isError ? 'error' :
                isProcessing ? 'current' : 'pending'
      },
      {
        id: 3,
        title: 'Análise de Segurança',
        description: isCompleted ? 'Análise de segurança concluída' : 'Avaliando vulnerabilidades e riscos',
        status: isCompleted ? 'completed' : 
                isError ? 'error' :
                isProcessing ? 'current' : 'pending'
      },
      {
        id: 4,
        title: 'Geração do Relatório',
        description: isCompleted ? 'Relatório gerado com sucesso' : 'Compilando análise técnica completa',
        status: isCompleted ? 'completed' : 
                isError ? 'error' : 'pending'
      }
    ];

    return steps;
  };

  const getEstimatedTime = () => {
    if (realStatus?.estimatedTimeRemaining) {
      return realStatus.estimatedTimeRemaining;
    }
    
    if (!upload) return null;
    
    const createdTime = new Date(upload.createdAt);
    const currentTime = new Date();
    const elapsedMinutes = Math.floor((currentTime - createdTime) / 60000);

    const status = currentStatus;
    switch (status) {
      case PROCESSING_STATUS.RECEIVED:
        return 'Iniciando processamento em instantes...';
      case PROCESSING_STATUS.PROCESSING: {
        const remaining = Math.max(0, 4 - elapsedMinutes);
        return remaining > 0 ? `Aproximadamente ${remaining} minutos restantes` : 'Finalizando análise...';
      }
      case PROCESSING_STATUS.ANALYZED:
        return 'Processamento concluído com sucesso';
      case PROCESSING_STATUS.ERROR:
        return 'Erro durante o processamento';
      default:
        return null;
    }
  };

  if (!upload || !isUploadInSelectedProject) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-md mb-6">
          <ProjectSelector
            includeAllOption
            label="Projeto do status"
            onChange={handleProjectChange}
          />
        </div>
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Não Encontrado</h2>
          <p className="text-gray-600 mb-6">
            {currentProjectId
              ? 'O projeto selecionado não possui upload compatível com esta consulta.'
              : 'O ID fornecido não corresponde a nenhum upload em nosso sistema.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/processing" className="btn-secondary">
              Ver Todos os Uploads
            </Link>
            <Link to="/upload" className="btn-primary">
              Novo Upload
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = getProcessingSteps();
  const progressPercentage = getUploadProgressPercentage(currentStatus);
  const estimatedTime = getEstimatedTime();

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-md mb-6">
        <ProjectSelector
          includeAllOption
          label="Projeto do status"
          onChange={handleProjectChange}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Status do Processamento
            </h1>
            <p className="text-gray-600">
              {currentProject
                ? `Acompanhe o progresso da análise do projeto ${currentProject.name}`
                : 'Acompanhe o progresso da análise do seu diagrama'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/processing" className="btn-secondary">
              ← Voltar à Lista
            </Link>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-primary"
            >
              {refreshing ? '🔄 Atualizando...' : '🔄 Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* File Information */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📄 Informações do Arquivo</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Nome do Arquivo:</span>
                <p className="text-gray-800">{upload.fileName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Tamanho:</span>
                <p className="text-gray-800">{formatFileSize(upload.fileSize)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Data do Upload:</span>
                <p className="text-gray-800">{formatDate(upload.createdAt)}</p>
              </div>
              {project && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Projeto:</span>
                  <p className="text-gray-800 flex items-center gap-1">
                    <span>📁</span>
                    {project.name}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Status Atual:</span>
                <div className="mt-1">
                  <span className={`status-badge ${getStatusColor(currentStatus)}`}>
                    {getStatusIcon(currentStatus)} {getStatusLabel(currentStatus)}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Última Atualização:</span>
                <p className="text-gray-800">{formatDate(upload.updatedAt)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Tempo Estimado:</span>
                <p className="text-gray-800">{estimatedTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">📈 Progresso Geral</h2>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  currentStatus === PROCESSING_STATUS.ERROR ? 'bg-red-500' : 
                  currentStatus === PROCESSING_STATUS.ANALYZED ? 'bg-green-500' : 'bg-fiap-blue'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Status Message */}
          <div className={`p-4 rounded-lg border ${
            currentStatus === PROCESSING_STATUS.ERROR ? 'bg-red-50 border-red-200' :
            currentStatus === PROCESSING_STATUS.ANALYZED ? 'bg-green-50 border-green-200' :
            currentStatus === PROCESSING_STATUS.PROCESSING ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <p className={`font-medium ${
              currentStatus === PROCESSING_STATUS.ERROR ? 'text-red-800' :
              currentStatus === PROCESSING_STATUS.ANALYZED ? 'text-green-800' :
              currentStatus === PROCESSING_STATUS.PROCESSING ? 'text-blue-800' :
              'text-gray-800'
            }`}>
              {currentStatus === PROCESSING_STATUS.RECEIVED && 'Arquivo recebido com sucesso! O processamento será iniciado em instantes.'}
              {currentStatus === PROCESSING_STATUS.PROCESSING && 'Análise em andamento. Nossos algoritmos estão examinando a arquitetura do seu sistema.'}
              {currentStatus === PROCESSING_STATUS.ANALYZED && 'Análise concluída! O relatório técnico completo está disponível para visualização.'}
              {currentStatus === PROCESSING_STATUS.ERROR && 'Erro durante o processamento. Nossa equipe foi notificada e está investigando o problema.'}
            </p>
          </div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">🔄 Etapas do Processamento</h2>
          
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                {/* Step Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                    step.status === 'current' ? 'bg-blue-500 border-blue-500 text-white' :
                    step.status === 'error' ? 'bg-red-500 border-red-500 text-white' :
                    'bg-gray-200 border-gray-300 text-gray-500'
                  }`}>
                    {step.status === 'completed' ? '✓' :
                     step.status === 'error' ? '✗' :
                     step.status === 'current' ? (
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                     ) : step.id}
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mx-auto mt-2 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <h3 className={`font-semibold ${
                    step.status === 'completed' ? 'text-green-800' :
                    step.status === 'current' ? 'text-blue-800' :
                    step.status === 'error' ? 'text-red-800' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  
                  {step.status === 'current' && (
                    <div className="mt-2">
                      <div className="bg-blue-100 rounded-full h-2">
                        <div className="bg-blue-500 rounded-full h-2 animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        {upload.status === PROCESSING_STATUS.ANALYZED && (
          <Link to={`/reports/${upload.id}`} className="btn-primary mr-4">
            📊 Ver Relatório Completo
          </Link>
        )}
        
        {upload.status === PROCESSING_STATUS.ERROR && (
          <button className="btn-primary mr-4">
            🔄 Tentar Novamente
          </button>
        )}
        
        {upload.status === PROCESSING_STATUS.PROCESSING && (
          <p className="text-sm text-gray-500 mt-4">
            💡 Esta página é atualizada automaticamente a cada 30 segundos
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusPage;