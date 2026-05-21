import { useState } from 'react';
import { useProject } from '../hooks/useProject';
import { ApiService } from '../services/apiService';
import { formatDate } from '../utils/helpers';

const OWNER_ID_DEFAULT = 'frontend-dev';

const ProjectsPage = () => {
  const {
    projects,
    currentProjectId,
    addProject,
    selectProject,
    isLoadingProjects,
    projectsError,
    refreshProjects
  } = useProject();
  const [form, setForm] = useState({ name: '', description: '', ownerId: OWNER_ID_DEFAULT });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Nome e obrigatorio';
    if (!form.description.trim()) errors.description = 'Descricao e obrigatoria';
    if (!form.ownerId.trim()) errors.ownerId = 'Owner ID e obrigatorio';
    return errors;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsCreating(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const created = await ApiService.createProject(
        form.name.trim(),
        form.description.trim(),
        form.ownerId.trim()
      );

      const project = {
        ...created,
        ownerId: created.ownerId || form.ownerId.trim(),
        createdAt: created.createdAt || new Date().toISOString()
      };

      addProject(project);
      selectProject(project.id);
      await refreshProjects();
      setForm({ name: '', description: '', ownerId: OWNER_ID_DEFAULT });
      setFieldErrors({});
      setSuccessMessage(`Projeto "${project.name}" criado e selecionado com sucesso.`);
    } catch (err) {
      setApiError(err.message || 'Erro ao criar projeto. Verifique a conexao com o servico.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projetos</h1>
        <p className="text-gray-600">
          Gerencie seus projetos. Cada upload fica vinculado ao projeto selecionado.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Novo Projeto</h2>

          <form onSubmit={handleCreate} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Arquitetura E-commerce v2"
                disabled={isCreating}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fiap-blue focus:border-transparent transition-colors ${
                  fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descricao <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descreva o objetivo ou contexto do projeto"
                rows={3}
                disabled={isCreating}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fiap-blue focus:border-transparent transition-colors resize-none ${
                  fieldErrors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.ownerId}
                onChange={(e) => handleChange('ownerId', e.target.value)}
                placeholder="Ex: frontend-dev"
                disabled={isCreating}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fiap-blue focus:border-transparent transition-colors ${
                  fieldErrors.ownerId ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {fieldErrors.ownerId && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.ownerId}</p>
              )}
            </div>

            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                isCreating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary hover:shadow-lg'
              }`}
            >
              {isCreating ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Criando...
                </span>
              ) : (
                'Criar Projeto'
              )}
            </button>
          </form>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Seus Projetos
              {projects.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({projects.length})
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={refreshProjects}
              disabled={isLoadingProjects}
              className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingProjects ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>

          {projectsError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {projectsError}
            </div>
          )}

          {isLoadingProjects ? (
            <div className="card p-8 text-center text-gray-500">
              Carregando projetos do backend...
            </div>
          ) : projects.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">
              <p className="text-4xl mb-3">📁</p>
              <p className="font-medium">Nenhum projeto criado ainda.</p>
              <p className="text-sm mt-1">
                Crie um projeto para começar a vincular seus uploads.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...projects].reverse().map((project) => {
                const isSelected = project.id === currentProjectId;
                return (
                  <div
                    key={project.id}
                    className={`card p-5 transition-all duration-200 ${
                      isSelected ? 'border-2 border-fiap-blue bg-blue-50' : 'border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {project.name}
                          </h3>
                          {isSelected && (
                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-fiap-blue text-white">
                              Selecionado
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 break-words">{project.description}</p>
                        <div className="mt-2 text-xs text-gray-400 space-y-0.5">
                          {project.ownerId && <p>Owner: {project.ownerId}</p>}
                          {project.createdAt && (
                            <p>Criado em: {formatDate(project.createdAt)}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => selectProject(project.id)}
                        disabled={isSelected}
                        className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-gray-100 text-gray-400 cursor-default'
                            : 'bg-fiap-blue text-white hover:bg-blue-700'
                        }`}
                      >
                        {isSelected ? 'Ativo' : 'Selecionar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
