export const todoistApiUrl = 'https://api.todoist.com/api/v1/';

export const resources = {
  tasks: 'tasks',
  projects: 'projects',
  sections: 'sections',
  labels: 'labels',
  notes: 'notes',
  reminders: 'reminders',
  events: 'events',
  comments: 'comments',
};

export enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export interface TodoistCallArgs {
  resource: string;
  method: Method;
  body?: any;
  query?: any;
}

export interface TodoistArgs {
  apiKey: string;
}

export class TodoistError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'TodoistError';
  }
}

export interface Project {
  id: string;
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  creatorUid: string;
  createdAt: string;
  isArchived: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  name: string;
  updatedAt: string;
  viewStyle: string;
  defaultOrder: number;
  description: string;
  publicKey: string;
  //access: ProjectAccessView;
  role: string;
  parentId: string;
  inboxProject: boolean;
  isCollapsed: boolean;
  isShared: boolean;
}

export interface Task {
  id: string;
}

export interface GetProjectsRequest {
  limit?: number;
}

export interface GetAllTasksRequest {
  projectId?: string | number;
  sectionId?: string | number;
  parentId?: string | number;
  label?: string;
  ids?: string[];
  limit?: number;
}
