import { useCallback, useEffect, useReducer, useState } from 'react';
import { ProjectContext } from './ProjectContext';
import { PROJECT_ACTIONS } from '../utils/constants';
import { ApiService } from '../services/apiService';

const PROJECTS_STORAGE_KEY = 'fiap-projects';
const SELECTED_PROJECT_KEY = 'fiap-selected-project';

const persistedSelectedId = localStorage.getItem(SELECTED_PROJECT_KEY) || null;

const initialState = {
  projects: [],
  currentProjectId: persistedSelectedId
};

function projectReducer(state, action) {
  let newState;

  switch (action.type) {
    case PROJECT_ACTIONS.SET_PROJECTS: {
      const projects = Array.isArray(action.payload) ? action.payload : [];
      const hasSelectedProject = projects.some((project) => project.id === state.currentProjectId);
      newState = {
        ...state,
        projects,
        currentProjectId: hasSelectedProject ? state.currentProjectId : null
      };
      break;
    }

    case PROJECT_ACTIONS.ADD_PROJECT:
      newState = {
        ...state,
        projects: state.projects.some((project) => project.id === action.payload.id)
          ? state.projects.map((project) => (project.id === action.payload.id ? action.payload : project))
          : [...state.projects, action.payload]
      };
      break;

    case PROJECT_ACTIONS.SELECT_PROJECT:
      newState = { ...state, currentProjectId: action.payload };
      break;

    default:
      return state;
  }

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(newState.projects));
  localStorage.setItem(SELECTED_PROJECT_KEY, newState.currentProjectId || '');
  return newState;
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  const refreshProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setProjectsError('');

    try {
      const projects = await ApiService.getProjects();
      dispatch({ type: PROJECT_ACTIONS.SET_PROJECTS, payload: projects });
    } catch (error) {
      dispatch({ type: PROJECT_ACTIONS.SET_PROJECTS, payload: [] });
      setProjectsError(error.message || 'Erro ao carregar projetos do backend.');
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const addProject = (project) => {
    dispatch({ type: PROJECT_ACTIONS.ADD_PROJECT, payload: project });
  };

  const selectProject = (projectId) => {
    dispatch({ type: PROJECT_ACTIONS.SELECT_PROJECT, payload: projectId });
  };

  const getProjectById = (id) => state.projects.find((p) => p.id === id) || null;

  const currentProject = getProjectById(state.currentProjectId);

  const value = {
    projects: state.projects,
    currentProjectId: state.currentProjectId,
    currentProject,
    addProject,
    selectProject,
    getProjectById,
    isLoadingProjects,
    projectsError,
    refreshProjects
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
