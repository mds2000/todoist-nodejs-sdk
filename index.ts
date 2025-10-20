import {
  CreateProjectRequest,
  CreateSectionRequest,
  GetAllTasksRequest,
  GetArchivedProjectsRequest,
  GetProjectColaboratorsRequest,
  GetProjectsRequest,
  GetSectionsRequest,
  Method,
  Project,
  ProjectColaborator,
  ProjectPermissions,
  Section,
  Task,
  TodoistArgs,
  TodoistCallArgs,
  TodoistError,
  UpdateProjectRequest,
  resources,
  todoistApiUrl,
} from './types';

export class Todoist {
  private readonly apiKey: string;

  constructor({ apiKey }: TodoistArgs) {
    if (!apiKey) {
      throw new TodoistError('Todoist apiKey is required');
    }

    this.apiKey = apiKey;
  }

  private async callTodoistApi({ resource, method, body, query }: TodoistCallArgs): Promise<any> {
    try {
      let url = `${todoistApiUrl}${resource}`;
      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };
      if (query) {
        const params = new URLSearchParams(query);
        url += `?${params.toString()}`;
      }
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const responseJson = await response.json();
      if (!response.ok || responseJson.error || responseJson.http_code) {
        throw new TodoistError(responseJson.error || responseJson.http_code, {
          cause: responseJson,
        });
      }
      return responseJson;
    } catch (error) {
      throw new TodoistError('Error calling Todoist API', { cause: error });
    }
  }

  public readonly projects = {
    getProjectById: async (projectId: string): Promise<Project> => {
      if (!projectId) {
        throw new TodoistError('projectId is required to getProjectById');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.projects}/${projectId}`,
        method: Method.Get,
      });
      return {
        id: response.id,
        canAssignTasks: response.can_assign_tasks,
        childOrder: response.child_order,
        color: response.color,
        creatorUid: response.creator_uid,
        createdAt: response.created_at,
        isArchived: response.is_archived,
        isDeleted: response.is_deleted,
        isFavorite: response.is_favorite,
        isFrozen: response.is_frozen,
        name: response.name,
        updatedAt: response.updated_at,
        viewStyle: response.view_style,
        defaultOrder: response.default_order,
        description: response.description,
        publicKey: response.public_key,
        role: response.role,
        parentId: response.parent_id,
        inboxProject: response.inbox_project,
        isCollapsed: response.is_collapsed,
        isShared: response.is_shared,
      };
    },
    getProjects: async (request?: GetProjectsRequest): Promise<Project[]> => {
      const response = await this.callTodoistApi({
        resource: resources.projects,
        method: Method.Get,
        query: request,
      });
      return response.results.map((p: any) => ({
        id: p.id,
        canAssignTasks: p.can_assign_tasks,
        childOrder: p.child_order,
        color: p.color,
        creatorUid: p.creator_uid,
        createdAt: p.created_at,
        isArchived: p.is_archived,
        isDeleted: p.is_deleted,
        isFavorite: p.is_favorite,
        isFrozen: p.is_frozen,
        name: p.name,
        updatedAt: p.updated_at,
        viewStyle: p.view_style,
        defaultOrder: p.default_order,
        description: p.description,
        publicKey: p.public_key,
        role: p.role,
        parentId: p.parent_id,
        inboxProject: p.inbox_project,
        isCollapsed: p.is_collapsed,
        isShared: p.is_shared,
      }));
    },
    getArchivedProjects: async (request?: GetArchivedProjectsRequest): Promise<Project[]> => {
      const response = await this.callTodoistApi({
        resource: `${resources.projects}/archived`,
        method: Method.Get,
        query: request,
      });
      return response.results.map((p: any) => ({
        id: p.id,
        canAssignTasks: p.can_assign_tasks,
        childOrder: p.child_order,
        color: p.color,
        creatorUid: p.creator_uid,
        createdAt: p.created_at,
        isArchived: p.is_archived,
        isDeleted: p.is_deleted,
        isFavorite: p.is_favorite,
        isFrozen: p.is_frozen,
        name: p.name,
        updatedAt: p.updated_at,
        viewStyle: p.view_style,
        defaultOrder: p.default_order,
        description: p.description,
        publicKey: p.public_key,
        role: p.role,
        parentId: p.parent_id,
        inboxProject: p.inbox_project,
        isCollapsed: p.is_collapsed,
        isShared: p.is_shared,
      }));
    },
    getProjectColaborators: async (request: GetProjectColaboratorsRequest): Promise<ProjectColaborator[]> => {
      if (!request.projectId) {
        throw new TodoistError('projectId is required to getProjectColaborators');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.projects}/${request.projectId}/collaborators`,
        method: Method.Get,
        query: {
          ...(request.limit ? { limit: request.limit } : {}),
          ...(request.publicKey ? { public_key: request.publicKey } : {}),
        },
      });
      return response.results.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
      }));
    },
    getProjectPermissions: async (): Promise<ProjectPermissions> => {
      const response = await this.callTodoistApi({
        resource: `${resources.projects}/permissions`,
        method: Method.Get,
      });
      return {
        projectCollaboratorActions: response.project_collaborator_actions.map((action: any) => ({
          name: action.name,
          actions: action.actions.map((a: any) => a.name),
        })),
        workspaceCollaboratorActions: response.workspace_collaborator_actions.map((action: any) => ({
          name: action.name,
          actions: action.actions.map((a: any) => a.name),
        })),
      };
    },
    createProject: async (request: CreateProjectRequest): Promise<Project> => {
      const response = await this.callTodoistApi({
        resource: resources.projects,
        method: Method.Post,
        body: request,
      });
      return {
        id: response.id,
        canAssignTasks: response.can_assign_tasks,
        childOrder: response.child_order,
        color: response.color,
        creatorUid: response.creator_uid,
        createdAt: response.created_at,
        isArchived: response.is_archived,
        isDeleted: response.is_deleted,
        isFavorite: response.is_favorite,
        isFrozen: response.is_frozen,
        name: response.name,
        updatedAt: response.updated_at,
        viewStyle: response.view_style,
        defaultOrder: response.default_order,
        description: response.description,
        publicKey: response.public_key,
        role: response.role,
        parentId: response.parent_id,
        inboxProject: response.inbox_project,
        isCollapsed: response.is_collapsed,
        isShared: response.is_shared,
      };
    },
    updateProject: async (request: UpdateProjectRequest): Promise<Project> => {
      if (!request.projectId) {
        throw new TodoistError('projectId is required to updateProject');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.projects}/${request.projectId}`,
        method: Method.Post,
        body: {
          ...(request.name ? { name: request.name } : {}),
          ...(request.description ? { description: request.description } : {}),
          ...(request.color ? { color: request.color } : {}),
          ...(request.isFavorite ? { is_favorite: request.isFavorite } : {}),
          ...(request.viewStyle ? { view_style: request.viewStyle } : {}),
          ...(request.isCollapsed ? { is_collapsed: request.isCollapsed } : {}),
        },
      });
      return {
        id: response.id,
        canAssignTasks: response.can_assign_tasks,
        childOrder: response.child_order,
        color: response.color,
        creatorUid: response.creator_uid,
        createdAt: response.created_at,
        isArchived: response.is_archived,
        isDeleted: response.is_deleted,
        isFavorite: response.is_favorite,
        isFrozen: response.is_frozen,
        name: response.name,
        updatedAt: response.updated_at,
        viewStyle: response.view_style,
        defaultOrder: response.default_order,
        description: response.description,
        publicKey: response.public_key,
        role: response.role,
        parentId: response.parent_id,
        inboxProject: response.inbox_project,
        isCollapsed: response.is_collapsed,
        isShared: response.is_shared,
      };
    },
  };

  public readonly sections = {
    getSections: async (request?: GetSectionsRequest): Promise<Section[]> => {
      const response = await this.callTodoistApi({
        resource: resources.sections,
        method: Method.Get,
        query: request,
      });
      return response.results.map((s: any) => ({
        id: s.id,
        name: s.name,
        projectId: s.project_id,
        order: s.order,
        isCollapsed: s.is_collapsed,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));
    },
    createSection: async (request: CreateSectionRequest): Promise<Section> => {
      if (!request.name) {
        throw new TodoistError('name is required to createSection');
      }
      if (!request.projectId) {
        throw new TodoistError('projectId is required to createSection');
      }

      const response = await this.callTodoistApi({
        resource: resources.sections,
        method: Method.Post,
        body: {
          name: request.name,
          project_id: request.projectId,
          ...(request.order ? { order: request.order } : {}),
        },
      });
      return {
        id: response.id,
        name: response.name,
        userId: response.user_id,
        projectId: response.project_id,
        sectionOrder: response.section_order,
        isCollapsed: response.is_collapsed,
        addedAt: response.added_at,
        updatedAt: response.updated_at,
        archivedAt: response.archived_at,
        isArchived: response.is_archived,
        isDeleted: response.is_deleted,
      };
    },
    getSectionById: async (sectionId: string): Promise<Section> => {
      if (!sectionId) {
        throw new TodoistError('sectionId is required to getSectionById');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.sections}/${sectionId}`,
        method: Method.Get,
      });
      return {
        id: response.id,
        name: response.name,
        userId: response.user_id,
        projectId: response.project_id,
        sectionOrder: response.section_order,
        isCollapsed: response.is_collapsed,
        addedAt: response.added_at,
        updatedAt: response.updated_at,
        archivedAt: response.archived_at,
        isArchived: response.is_archived,
        isDeleted: response.is_deleted,
      };
    },
  };

  public readonly tasks = {
    getTasks: async (request: GetAllTasksRequest): Promise<Task[]> => {
      if (!request.projectId && !request.sectionId && !request.parentId && !request.ids) {
        throw new TodoistError('At least one of projectId, sectionId, partentId or ids is required');
      }

      return this.callTodoistApi({
        resource: resources.tasks,
        method: Method.Get,
        query: request,
      });
    },
  };
}
