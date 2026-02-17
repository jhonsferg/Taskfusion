export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

export const Status = {
  BACKLOG: "backlog",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export interface ProjectBase {
  name: string;
  description?: string;
}

export interface Project extends ProjectBase {
  id: string;
  created_at: string;
}

export interface TaskBase {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  due_date?: string;
}

export interface TaskCreate extends TaskBase {
  project_id: string;
}

export interface Task extends TaskBase {
  id: string;
  project_id: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_tasks: number;
  tasks_by_status: Record<string, number>;
  tasks_by_project: Record<string, number>;
  overdue_tasks: number;
}

export type TaskUpdate = Partial<TaskCreate>;
