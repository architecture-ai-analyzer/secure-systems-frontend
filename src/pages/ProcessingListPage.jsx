import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProcessing } from '../hooks/useProcessing';
import { useProject } from '../hooks/useProject';
import ProjectSelector from '../components/ProjectSelector';
import { PROCESSING_STATUS } from '../utils/constants';
import { formatDate, formatFileSize, getStatusIcon, getStatusColor, getStatusLabel, truncateFileName } from '../utils/helpers';

const ProcessingListPage = () => {
  const { uploads } = useProcessing();
  const { currentProjectId, currentProject, projects, getProjectById } = useProject();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [processingProgress] = useState(() => Math.random() * 40 + 30);

  const projectScopedUploads = currentProjectId
    ? uploads.filter((upload) => upload.projectId === currentProjectId)
    : uploads;

  // Filter uploads
  const filteredUploads = projectScopedUploads.filter(upload => {
    const statusMatch = filter === 'all' || upload.status === filter;
    return statusMatch;
  });

  // Sort uploads
  const sortedUploads = [...filteredUploads].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.fileName.localeCompare(b.fileName);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const getStatusCounts = () => {
    return {
      all: projectScopedUploads.length,
      [PROCESSING_STATUS.RECEIVED]: projectScopedUploads.filter(u => u.status === PROCESSING_STATUS.RECEIVED).length,
      [PROCESSING_STATUS.PROCESSING]: projectScopedUploads.filter(u => u.status === PROCESSING_STATUS.PROCESSING).length,
      [PROCESSING_STATUS.ANALYZED]: projectScopedUploads.filter(u => u.status === PROCESSING_STATUS.ANALYZED).length,
      [PROCESSING_STATUS.ERROR]: projectScopedUploads.filter(u => u.status === PROCESSING_STATUS.ERROR).length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lista de Processamento
        </h1>
        <p className="text-gray-600">
          {currentProject
            ? `Acompanhe o status dos diagramas do projeto ${currentProject.name}`
            : 'Acompanhe o status de todos os diagramas enviados para análise'}
        </p>
      </div>

      <div className="max-w-md mb-6">
        <ProjectSelector includeAllOption label="Escopo do projeto" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{statusCounts.all}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statusCounts[PROCESSING_STATUS.RECEIVED]}</div>
          <div className="text-sm text-gray-600">Recebidos</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts[PROCESSING_STATUS.PROCESSING]}</div>
          <div className="text-sm text-gray-600">Processando</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statusCounts[PROCESSING_STATUS.ANALYZED]}</div>
          <div className="text-sm text-gray-600">Analisados</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statusCounts[PROCESSING_STATUS.ERROR]}</div>
          <div className="text-sm text-gray-600">Erros</div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-fiap-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({statusCounts.all})
            </button>
            {Object.values(PROCESSING_STATUS).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status 
                    ? 'bg-fiap-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getStatusIcon(status)} {getStatusLabel(status)} ({statusCounts[status]})
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fiap-blue focus:border-transparent"
            >
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="name">Nome do Arquivo</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload List */}
      {sortedUploads.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">📤</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nenhum diagrama encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Você ainda não enviou nenhum diagrama para análise.'
              : `Nenhum diagrama com status "${filter}" encontrado.`
            }
          </p>
          <Link to="/upload" className="btn-primary">
            Enviar Primeiro Diagrama
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedUploads.map((upload) => (
            <div key={upload.id} className="card">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* File Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">📄</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {truncateFileName(upload.fileName)}
                        </h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          {upload.projectId && getProjectById(upload.projectId) && (
                            <p className="flex items-center gap-1">
                              <span>📁</span>
                              <span className="font-medium text-gray-600">
                                {getProjectById(upload.projectId).name}
                              </span>
                            </p>
                          )}
                          <p>Tamanho: {formatFileSize(upload.fileSize)}</p>
                          <p>Upload: {formatDate(upload.createdAt)}</p>
                          <p>Atualização: {formatDate(upload.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-4">
                    <span className={`status-badge ${getStatusColor(upload.status)}`}>
                      {getStatusIcon(upload.status)} {getStatusLabel(upload.status)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/status/${upload.id}`}
                      className="btn-secondary text-sm"
                    >
                      Ver Status
                    </Link>
                    
                    {upload.status === PROCESSING_STATUS.ANALYZED && (
                      <Link
                        to={`/reports/${upload.id}`}
                        className="btn-primary text-sm"
                      >
                        Ver Relatório
                      </Link>
                    )}

                    {upload.status === PROCESSING_STATUS.ERROR && (
                      <button className="btn-secondary text-sm text-red-600">
                        Reenviar
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Processing */}
                {upload.status === PROCESSING_STATUS.PROCESSING && (
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-fiap-blue rounded-full h-2 transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Analisando componentes e vulnerabilidades...
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button 
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          🔄 Atualizar Status
        </button>
      </div>
    </div>
  );
};

export default ProcessingListPage;