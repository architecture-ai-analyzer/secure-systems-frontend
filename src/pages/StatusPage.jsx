import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProcessing } from '../hooks/useProcessing';
import { PROCESSING_STATUS } from '../utils/constants';
import { formatDate, formatFileSize, getStatusIcon, getStatusColor } from '../utils/helpers';

const StatusPage = () => {
  const { uploadId } = useParams();
  const { getUploadById } = useProcessing();
  const [refreshing, setRefreshing] = useState(false);
  
  const upload = uploadId ? getUploadById(uploadId) : null;

  // Auto-refresh for processing items
  useEffect(() => {
    if (upload?.status === PROCESSING_STATUS.EM_PROCESSAMENTO) {
      const interval = setInterval(() => {
        // This would trigger a re-render to show updated status
        window.location.reload();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [upload?.status]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getProgressPercentage = () => {
    switch (upload?.status) {
      case PROCESSING_STATUS.RECEBIDO:
        return 25;
      case PROCESSING_STATUS.EM_PROCESSAMENTO:
        return 65;
      case PROCESSING_STATUS.ANALISADO:
        return 100;
      case PROCESSING_STATUS.ERRO:
        return 100;
      default:
        return 0;
    }
  };

  const getProcessingSteps = () => {
    const steps = [
      {
        id: 1,
        title: 'Recebimento do Arquivo',
        description: 'Arquivo PDF recebido e validado',
        status: upload?.status === PROCESSING_STATUS.RECEBIDO ? 'current' : 
                upload ? 'completed' : 'pending'
      },
      {
        id: 2,
        title: 'Análise de Componentes',
        description: 'Identificando elementos da arquitetura',
        status: upload?.status === PROCESSING_STATUS.EM_PROCESSAMENTO ? 'current' : 
                upload?.status === PROCESSING_STATUS.ANALISADO ? 'completed' :
                upload?.status === PROCESSING_STATUS.ERRO ? 'error' : 'pending'
      },
      {
        id: 3,
        title: 'Análise de Segurança',
        description: 'Avaliando vulnerabilidades e riscos',
        status: upload?.status === PROCESSING_STATUS.EM_PROCESSAMENTO ? 'current' : 
                upload?.status === PROCESSING_STATUS.ANALISADO ? 'completed' :
                upload?.status === PROCESSING_STATUS.ERRO ? 'error' : 'pending'
      },
      {
        id: 4,
        title: 'Geração do Relatório',
        description: 'Compilando análise técnica completa',
        status: upload?.status === PROCESSING_STATUS.ANALISADO ? 'completed' :
                upload?.status === PROCESSING_STATUS.ERRO ? 'error' : 'pending'
      }
    ];

    return steps;
  };

  const getEstimatedTime = () => {
    if (!upload) return null;
    
    const createdTime = new Date(upload.createdAt);
    const currentTime = new Date();
    const elapsedMinutes = Math.floor((currentTime - createdTime) / 60000);

    switch (upload.status) {
      case PROCESSING_STATUS.RECEBIDO:
        return 'Iniciando processamento em instantes...';
      case PROCESSING_STATUS.EM_PROCESSAMENTO: {
        const remaining = Math.max(0, 4 - elapsedMinutes);
        return remaining > 0 ? `Aproximadamente ${remaining} minutos restantes` : 'Finalizando análise...';
      }
      case PROCESSING_STATUS.ANALISADO:
        return 'Processamento concluído com sucesso';
      case PROCESSING_STATUS.ERRO:
        return 'Erro durante o processamento';
      default:
        return null;
    }
  };

  if (!upload) {
    return (
      <div className="p-6 lg:p-8">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Não Encontrado</h2>
          <p className="text-gray-600 mb-6">
            O ID fornecido não corresponde a nenhum upload em nosso sistema.
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
  const progressPercentage = getProgressPercentage();
  const estimatedTime = getEstimatedTime();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Status do Processamento
            </h1>
            <p className="text-gray-600">
              Acompanhe o progresso da análise do seu diagrama
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
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Status Atual:</span>
                <div className="mt-1">
                  <span className={`status-badge ${getStatusColor(upload.status)}`}>
                    {getStatusIcon(upload.status)} {upload.status}
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
                  upload.status === PROCESSING_STATUS.ERRO ? 'bg-red-500' : 
                  upload.status === PROCESSING_STATUS.ANALISADO ? 'bg-green-500' : 'bg-fiap-blue'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Status Message */}
          <div className={`p-4 rounded-lg border ${
            upload.status === PROCESSING_STATUS.ERRO ? 'bg-red-50 border-red-200' :
            upload.status === PROCESSING_STATUS.ANALISADO ? 'bg-green-50 border-green-200' :
            upload.status === PROCESSING_STATUS.EM_PROCESSAMENTO ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <p className={`font-medium ${
              upload.status === PROCESSING_STATUS.ERRO ? 'text-red-800' :
              upload.status === PROCESSING_STATUS.ANALISADO ? 'text-green-800' :
              upload.status === PROCESSING_STATUS.EM_PROCESSAMENTO ? 'text-blue-800' :
              'text-gray-800'
            }`}>
              {upload.status === PROCESSING_STATUS.RECEBIDO && 'Arquivo recebido com sucesso! O processamento será iniciado em instantes.'}
              {upload.status === PROCESSING_STATUS.EM_PROCESSAMENTO && 'Análise em andamento. Nossos algoritmos estão examinando a arquitetura do seu sistema.'}
              {upload.status === PROCESSING_STATUS.ANALISADO && 'Análise concluída! O relatório técnico completo está disponível para visualização.'}
              {upload.status === PROCESSING_STATUS.ERRO && 'Erro durante o processamento. Nossa equipe foi notificada e está investigando o problema.'}
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
        {upload.status === PROCESSING_STATUS.ANALISADO && (
          <Link to={`/reports/${upload.id}`} className="btn-primary mr-4">
            📊 Ver Relatório Completo
          </Link>
        )}
        
        {upload.status === PROCESSING_STATUS.ERRO && (
          <button className="btn-primary mr-4">
            🔄 Tentar Novamente
          </button>
        )}
        
        {upload.status === PROCESSING_STATUS.EM_PROCESSAMENTO && (
          <p className="text-sm text-gray-500 mt-4">
            💡 Esta página é atualizada automaticamente a cada 30 segundos
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusPage;