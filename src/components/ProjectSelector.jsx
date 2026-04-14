import { useProject } from '../hooks/useProject';

const ProjectSelector = ({
  label = 'Projeto',
  includeAllOption = false,
  allLabel = 'Todos os projetos',
  onChange,
  disabled = false,
  className = ''
}) => {
  const { projects, currentProjectId, selectProject } = useProject();

  const handleChange = (event) => {
    const nextProjectId = event.target.value;
    selectProject(nextProjectId || null);
    onChange?.(nextProjectId || null);
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={currentProjectId || ''}
        onChange={handleChange}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fiap-blue focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
      >
        {includeAllOption && <option value="">{allLabel}</option>}
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
