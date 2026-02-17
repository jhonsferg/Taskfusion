import api from "../api/client";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectWithTasks,
} from "../types";

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects");
  return response.data;
};

export const getProjectWithTasks = async (
  projectId: string,
): Promise<ProjectWithTasks> => {
  const response = await api.get<ProjectWithTasks>(`/projects/${projectId}`);
  return response.data;
};

export const createProject = async (
  project: ProjectCreate,
): Promise<Project> => {
  const response = await api.post<Project>("/projects", project);
  return response.data;
};

export const updateProject = async (
  projectId: string,
  project: ProjectUpdate,
): Promise<Project> => {
  const response = await api.put<Project>(`/projects/${projectId}`, project);
  return response.data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}`);
};
