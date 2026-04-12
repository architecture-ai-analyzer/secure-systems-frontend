import { useState, useRef } from 'react';
import { validateUploadFile, formatFileSize } from '../utils/helpers';

const FileUploader = ({ onFileSelect, isUploading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    const validation = validateUploadFile(file);
    
    if (validation.isValid) {
      setSelectedFile(file);
      setValidationErrors([]);
      onFileSelect(file);
    } else {
      setSelectedFile(null);
      setValidationErrors(validation.errors);
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
          ${dragActive 
            ? 'border-fiap-blue bg-blue-50' 
            : selectedFile 
              ? 'border-green-400 bg-green-50' 
              : validationErrors.length > 0
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpg,image/jpeg"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fiap-blue mb-4"></div>
              <p className="text-lg font-medium text-gray-700">Enviando arquivo...</p>
              <p className="text-sm text-gray-500">Aguarde enquanto processamos seu diagrama</p>
            </div>
          ) : (
            <>
              <div className="text-6xl">📄</div>
              
              {selectedFile ? (
                <div className="text-green-600">
                  <p className="text-lg font-medium">✅ Arquivo selecionado</p>
                  <p className="text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Arraste e solte seu arquivo aqui
                  </p>
                  <p className="text-sm text-gray-500">
                    ou clique para selecionar o arquivo
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-400 space-y-1">
                <p>• Formatos aceitos: PDF, PNG, JPG e JPEG</p>
                <p>• Tamanho máximo: 10MB</p>
                <p>• Formatos suportados: Diagramas de arquitetura, UML, fluxogramas</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-2">Erros encontrados:</p>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Success */}
      {selectedFile && !validationErrors.length && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Arquivo válido! Clique em "Enviar Diagrama" para iniciar a análise.
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;