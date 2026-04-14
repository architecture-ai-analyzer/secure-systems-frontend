import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProcessing } from '../hooks/useProcessing';
import { useProject } from '../hooks/useProject';
import FileUploader from '../components/FileUploader';
import { ApiService } from '../services/apiService';
import { PROCESSING_STATUS } from '../utils/constants';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const { addUpload } = useProcessing();
  const { currentProject, currentProjectId } = useProject();
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentProject) return;

    setIsUploading(true);
    setUploadError('');
    
    try {
      const uploadResponse = await ApiService.createUpload(
        selectedFile,
        currentProject.id,
        currentProject.ownerId || 'frontend-dev'
      );

      const uploadId = uploadResponse.uploadId;

      let status = PROCESSING_STATUS.RECEBIDO;
      let createdAt = new Date().toISOString();
      let updatedAt = createdAt;

      try {
        const backendUpload = await ApiService.getUpload(uploadId);
        status = backendUpload.status?.toLowerCase() === 'completed'
          ? PROCESSING_STATUS.ANALISADO
          : PROCESSING_STATUS.RECEBIDO;
        createdAt = backendUpload.createdAt || createdAt;
        updatedAt = backendUpload.completedAt || backendUpload.createdAt || updatedAt;
      } catch (statusError) {
        console.warn('Could not fetch upload status after creation:', statusError);
      }

      addUpload({
        id: uploadId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        projectId: currentProject.id,
        projectName: currentProject.name,
        uploaderId: currentProject.ownerId || 'frontend-dev',
        status,
        createdAt,
        updatedAt
      });
      
      // Show success message and redirect
      setTimeout(() => {
        setIsUploading(false);
        navigate(`/status/${uploadId}`);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Falha ao enviar arquivo para o servico de upload.');
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload de Diagrama de Arquitetura
        </h1>
        <p className="text-gray-600">
          Envie seu diagrama de arquitetura em PDF, PNG, JPG ou JPEG para receber uma análise técnica detalhada 
          com foco em segurança, performance e recomendações arquiteturais.
        </p>
      </div>

      {/* Aviso de projeto não selecionado */}
      {!currentProjectId && (
        <div className="max-w-2xl mx-auto mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 flex items-start gap-3">
          <span className="text-yellow-500 text-xl">⚠️</span>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Nenhum projeto selecionado
            </p>
            <p className="text-sm text-yellow-700 mt-0.5">
              Selecione ou crie um projeto antes de enviar.{' '}
              <Link to="/projects" className="underline font-semibold hover:text-yellow-900">
                Ir para Projetos
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Projeto selecionado */}
      {currentProject && (
        <div className="max-w-2xl mx-auto mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-center gap-3">
          <span className="text-blue-500 text-xl">📁</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-900">Projeto selecionado</p>
            <p className="text-sm text-blue-700 truncate">{currentProject.name}</p>
          </div>
          <Link
            to="/projects"
            className="shrink-0 text-xs text-blue-600 underline hover:text-blue-800"
          >
            Trocar
          </Link>
        </div>
      )}

      {/* Upload Section */}
      <div className="max-w-2xl mx-auto">
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Selecionar Diagrama
          </h2>
          
          <FileUploader 
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
          />

          {uploadError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {uploadError}
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || !currentProjectId}
              className={`
                px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200
                ${selectedFile && !isUploading
                  ? 'btn-primary hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isUploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar Diagrama'
              )}
            </button>
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              🔍 O que será analisado
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Componentes da arquitetura</li>
              <li>• Vulnerabilidades de segurança</li>
              <li>• Padrões arquiteturais</li>
              <li>• Métricas de performance</li>
              <li>• Pontos de melhoria</li>
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              ⏱️ Tempo de processamento
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• <strong>Recebido:</strong> Imediato</li>
              <li>• <strong>Processamento:</strong> 2-4 minutos</li>
              <li>• <strong>Relatório:</strong> Disponível após análise</li>
              <li>• <strong>Notificação:</strong> Status em tempo real</li>
            </ul>
          </div>
        </div>

        {/* Recent Uploads Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Após o upload, você pode acompanhar o progresso na seção "Lista de Processamento"
          </p>
          <button
            onClick={() => navigate('/processing')}
            className="btn-secondary"
          >
            Ver Uploads Anteriores
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;