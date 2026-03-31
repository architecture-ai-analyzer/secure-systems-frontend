import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProcessing } from '../hooks/useProcessing';
import FileUploader from '../components/FileUploader';
import ReportApiService from '../services/reportApiService';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { addUpload } = useProcessing();
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      // Add to local state first
      const uploadId = addUpload(selectedFile);
      
      // Try to upload to backend
      try {
        await ReportApiService.uploadDiagram(uploadId, selectedFile);
        console.log('Upload to backend successful');
      } catch (error) {
        console.warn('Backend upload failed, continuing with local simulation:', error);
      }
      
      // Show success message and redirect
      setTimeout(() => {
        setIsUploading(false);
        navigate(`/status/${uploadId}`);
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
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
          Envie seu diagrama de arquitetura em PDF para receber uma análise técnica detalhada 
          com foco em segurança, performance e recomendações arquiteturais.
        </p>
      </div>

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

          {/* Upload Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
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