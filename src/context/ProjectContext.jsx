import { useReducer } from 'react';
import { ProjectContext } from './ProjectContext';
import { PROJECT_ACTIONS } from '../utils/constants';

const PROJECTS_STORAGE_KEY = 'fiap-projects';
const SELECTED_PROJECT_KEY = 'fiap-selected-project';

const persistedProjects = JSON.parse(localStorage.getItem(PROJECTS_STORAGE_KEY) || '[]');
const persistedSelectedId = localStorage.getItem(SELECTED_PROJECT_KEY) || null;

const initialState = {
  projects: persistedProjects,
  currentProjectId: persistedSelectedId
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

    default:
      return state;
  }

  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(newState.projects));
  localStorage.setItem(SELECTED_PROJECT_KEY, newState.currentProjectId || '');
  return newState;
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

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
    getProjectById
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
