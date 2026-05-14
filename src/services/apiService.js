const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function mapErrorMessage(status, body) {
  if (status === 404) return 'Recurso nao encontrado.';
  if (status === 400) return 'Requisicao invalida.';
  if (status >= 500) return 'Falha interna no servidor.';
  return body?.message || 'Falha na comunicacao com a API.';
}

async function request(path, options = {}) {
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = hasBody && typeof FormData !== 'undefined' && options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    },
    ...options
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(mapErrorMessage(response.status, body));
  }

  return body;
}

export class ApiService {
  static async getProjects() {
    return request('/v1/projects', {
      method: 'GET'
    });
  }

  static async createProject(name, description, ownerId) {
    return request('/v1/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description, ownerId })
    });
  }

  static async createUpload(file, projectId, uploaderId = 'frontend-dev') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'metadata',
      new Blob(
        [
          JSON.stringify({
            filename: file.name,
            projectId,
            uploaderId
          })
        ],
        { type: 'application/json' }
      )
    );

    return request('/v1/uploads', {
      method: 'POST',
      body: formData
    });
  }

  static async getUpload(uploadId) {
    return request(`/v1/uploads/${uploadId}`, {
      method: 'GET'
    });
  }
}
