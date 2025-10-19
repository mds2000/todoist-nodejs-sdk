import {
  GetAllTasksRequest,
  GetArchivedProjectsRequest,
  GetProjectsRequest,
  Method,
  Project,
  Task,
  TodoistArgs,
  TodoistCallArgs,
  TodoistError,
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
