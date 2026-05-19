import { useReducer, useEffect } from 'react';
import { ProjectContext } from './ProjectContext';
import { PROJECT_ACTIONS } from '../utils/constants';
import { ApiService } from '../services/apiService';

const PROJECTS_STORAGE_KEY = 'fiap-projects';
const SELECTED_PROJECT_KEY = 'fiap-selected-project';

const persistedProjects = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '[]');
const persistedSelectedId = localStorage.getItem(SELECTED_PROJECT_KEY) || null;

const initialState = {
  projects: persistedProjects,
  currentProjectId: persistedSelectedId,
  isLoading: false,
  error: null
};

function projectReducer(state, action) {
  let newState;

  switch (action.type) {
    case PROJECT_ACTIONS.ADD_PROJECT:
      newState = { ...state, projects: [...state.projects, action.payload] };
      break;

    case PROJECT_ACTIONS.SELECT_PROJECT:
      newState = { ...state, currentProjectId: action.payload };
      break;

    case 'SET_LOADING':
      newState = { ...state, isLoading: action.payload };
      break;

    case 'SET_PROJECTS':
      newState = { ...state, projects: action.payload, error: null };
      break;

    case 'SET_ERROR':
      newState = { ...state, error: action.payload, isLoading: false };
      break;

    default:
      return state;
  }

  if (action.type !== 'SET_LOADING' && action.type !== 'SET_ERROR') {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(newState.projects));
  }
  if (action.type === PROJECT_ACTIONS.SELECT_PROJECT) {
    localStorage.setItem(SELECTED_PROJECT_KEY, newState.currentProjectId || '');
  }
  return newState;
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Carregar projetos do backend na primeira renderização
  useEffect(() => {
    const loadProjects = async () => {
      // Se localStorage já tem projetos, não precisa carregar de novo
      if (persistedProjects.length > 0) {
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const projects = await ApiService.listProjects();
        dispatch({ type: 'SET_PROJECTS', payload: projects || [] });
      } catch (error) {
        console.warn('Failed to load projects from backend:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        // Usar localStorage vazio se falhar
        dispatch({ type: 'SET_PROJECTS', payload: [] });
      }
    };

    loadProjects();
  }, []);

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
    isLoading: state.isLoading,
    error: state.error
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
