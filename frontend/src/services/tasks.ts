import api from "../api/client";
import type { Task, Project, TaskCreate, TaskUpdate } from "../types";

export const getTasks = async (projectId?: string): Promise<Task[]> => {
  const url = projectId ? `/tasks?project_id=${projectId}` : "/tasks";
  const response = await api.get<Task[]>(url);
  return response.data;
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>("/tasks", task);
  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  status: string,
): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${taskId}`, { status });
  return response.data;
};

export const updateTask = async (
  taskId: string,
  task: TaskUpdate,
): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${taskId}`, task);
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>("/projects");
  return response.data;
};
