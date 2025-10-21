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

export interface ProjectColaborator {
  id: string;
  name: string;
  email: string;
}

export enum ProjectCollaboratorActionName {
  CREATOR = 'CREATOR',
  ADMIN = 'ADMIN',
  READ_WRITE = 'READ_WRITE',
  READ_ONLY = 'READ_ONLY',
}

export interface Action {
  name: string;
}

export interface CollaboratorAction {
  actions: Action[];
  name: ProjectCollaboratorActionName;
}

export interface ProjectPermissions {
  projectCollaboratorActions: CollaboratorAction[];
  workspaceCollaboratorActions: CollaboratorAction[];
}

export interface Section {
  id: string;
  name: string;
  userId: string;
  projectId: string;
  addedAt: string;
  updatedAt: string;
  archivedAt: string;
  sectionOrder: number;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
}

export interface Task {
  id: string;
  content: string;
  description: string;
  projectId: string;
  sectionId?: string;
  parentId?: string;
  order: number;
  priority: number;
  due?: {
    date: string;
    isRecurring: boolean;
    datetime?: string;
    string?: string;
    timezone?: string;
  };
  labels: string[];
  assigneeId?: string;
  assignerId?: string;
  commentCount: number;
  isCompleted: boolean;
  createdAt: string;
  creatorId: string;
  url: string;
  duration?: {
    amount: number;
    unit: string;
  };
}

export interface CompletedTask {
  id: string;
  taskId: string;
  content: string;
  projectId: string;
  sectionId?: string;
  completedAt: string;
  userId: string;
  note?: string;
}

export interface GetProjectsRequest {
  limit?: number;
}

export interface GetArchivedProjectsRequest {
  limit?: number;
}

export interface GetProjectColaboratorsRequest {
  projectId: string;
  limit?: number;
  publicKey?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  parentId?: string | number;
  color?: string | number;
  isFavorite?: boolean;
  viewStyle?: string;
}

export interface UpdateProjectRequest {
  projectId: string;
  name?: string;
  description?: string;
  color?: string | number;
  isFavorite?: boolean;
  viewStyle?: string;
  isCollapsed?: boolean;
}

export interface GetAllTasksRequest {
  projectId?: string | number;
  sectionId?: string | number;
  parentId?: string | number;
  label?: string;
  ids?: string[];
  limit?: number;
}

export interface GetSectionsRequest {
  projectId?: string;
  limit?: number;
}

export interface CreateSectionRequest {
  name: string;
  projectId: string;
  order?: number;
}

export interface UpdateSectionRequest {
  sectionId: string;
  name: string;
}

export interface CreateTaskRequest {
  content: string;
  description?: string;
  projectId?: string;
  sectionId?: string;
  parentId?: string;
  order?: number;
  labels?: string[];
  priority?: number;
  dueString?: string;
  dueDate?: string;
  dueDatetime?: string;
  dueLang?: string;
  assigneeId?: string;
  duration?: number;
  durationUnit?: 'minute' | 'day';
}

export interface UpdateTaskRequest {
  taskId: string;
  content?: string;
  description?: string;
  labels?: string[];
  priority?: number;
  dueString?: string;
  dueDate?: string;
  dueDatetime?: string;
  dueLang?: string;
  assigneeId?: string;
  duration?: number;
  durationUnit?: 'minute' | 'day';
}

export interface GetTasksByFilterRequest {
  filter: string;
  lang?: string;
  limit?: number;
}

export interface QuickAddTaskRequest {
  text: string;
  note?: string;
  reminder?: string;
  autoReminder?: boolean;
}

export interface MoveTaskRequest {
  taskId: string;
  projectId?: string;
  sectionId?: string;
  parentId?: string;
}

export interface GetCompletedTasksRequest {
  sortBy: 'completionDate' | 'dueDate';
  projectId?: string;
  sectionId?: string;
  limit?: number;
  cursor?: string;
  since?: string;
  until?: string;
}
