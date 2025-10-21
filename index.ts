import {
  CompletedTask,
  CreateProjectRequest,
  CreateSectionRequest,
  CreateTaskRequest,
  GetAllTasksRequest,
  GetArchivedProjectsRequest,
  GetCompletedTasksRequest,
  GetProjectColaboratorsRequest,
  GetProjectsRequest,
  GetSectionsRequest,
  GetTasksByFilterRequest,
  Method,
  MoveTaskRequest,
  Project,
  ProjectColaborator,
  ProjectPermissions,
  QuickAddTaskRequest,
  Section,
  Task,
  TodoistArgs,
  TodoistCallArgs,
  TodoistError,
  UpdateProjectRequest,
  UpdateSectionRequest,
  UpdateTaskRequest,
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

      // Handle 204 No Content responses (e.g., DELETE operations)
      if (response.status === 204) {
        return;
      }

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
    updateSection: async (request: UpdateSectionRequest): Promise<Section> => {
      if (!request.sectionId) {
        throw new TodoistError('sectionId is required to updateSection');
      }
      if (!request.name) {
        throw new TodoistError('name is required to updateSection');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.sections}/${request.sectionId}`,
        method: Method.Post,
        body: {
          name: request.name,
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
    deleteSection: async (sectionId: string): Promise<void> => {
      if (!sectionId) {
        throw new TodoistError('sectionId is required to deleteSection');
      }

      await this.callTodoistApi({
        resource: `${resources.sections}/${sectionId}`,
        method: Method.Delete,
      });
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
    createTask: async (request: CreateTaskRequest): Promise<Task> => {
      if (!request.content) {
        throw new TodoistError('content is required to createTask');
      }

      const response = await this.callTodoistApi({
        resource: resources.tasks,
        method: Method.Post,
        body: {
          content: request.content,
          ...(request.description ? { description: request.description } : {}),
          ...(request.projectId ? { project_id: request.projectId } : {}),
          ...(request.sectionId ? { section_id: request.sectionId } : {}),
          ...(request.parentId ? { parent_id: request.parentId } : {}),
          ...(request.order !== undefined ? { order: request.order } : {}),
          ...(request.labels ? { labels: request.labels } : {}),
          ...(request.priority !== undefined ? { priority: request.priority } : {}),
          ...(request.dueString ? { due_string: request.dueString } : {}),
          ...(request.dueDate ? { due_date: request.dueDate } : {}),
          ...(request.dueDatetime ? { due_datetime: request.dueDatetime } : {}),
          ...(request.dueLang ? { due_lang: request.dueLang } : {}),
          ...(request.assigneeId ? { assignee_id: request.assigneeId } : {}),
          ...(request.duration !== undefined ? { duration: request.duration } : {}),
          ...(request.durationUnit ? { duration_unit: request.durationUnit } : {}),
        },
      });
      return {
        id: response.id,
        content: response.content,
        description: response.description,
        projectId: response.project_id,
        sectionId: response.section_id,
        parentId: response.parent_id,
        order: response.order,
        priority: response.priority,
        due: response.due
          ? {
              date: response.due.date,
              isRecurring: response.due.is_recurring,
              datetime: response.due.datetime,
              string: response.due.string,
              timezone: response.due.timezone,
            }
          : undefined,
        labels: response.labels || [],
        assigneeId: response.assignee_id,
        assignerId: response.assigner_id,
        commentCount: response.comment_count,
        isCompleted: response.is_completed,
        createdAt: response.created_at,
        creatorId: response.creator_id,
        url: response.url,
        duration: response.duration
          ? {
              amount: response.duration.amount,
              unit: response.duration.unit,
            }
          : undefined,
      };
    },
    getTaskById: async (taskId: string): Promise<Task> => {
      if (!taskId) {
        throw new TodoistError('taskId is required to getTaskById');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.tasks}/${taskId}`,
        method: Method.Get,
      });
      return {
        id: response.id,
        content: response.content,
        description: response.description,
        projectId: response.project_id,
        sectionId: response.section_id,
        parentId: response.parent_id,
        order: response.order,
        priority: response.priority,
        due: response.due
          ? {
              date: response.due.date,
              isRecurring: response.due.is_recurring,
              datetime: response.due.datetime,
              string: response.due.string,
              timezone: response.due.timezone,
            }
          : undefined,
        labels: response.labels || [],
        assigneeId: response.assignee_id,
        assignerId: response.assigner_id,
        commentCount: response.comment_count,
        isCompleted: response.is_completed,
        createdAt: response.created_at,
        creatorId: response.creator_id,
        url: response.url,
        duration: response.duration
          ? {
              amount: response.duration.amount,
              unit: response.duration.unit,
            }
          : undefined,
      };
    },
    getCompletedTasks: async (request: GetCompletedTasksRequest): Promise<CompletedTask[]> => {
      if (!request.sortBy) {
        throw new TodoistError('sortBy is required to getCompletedTasks');
      }

      const endpoint =
        request.sortBy === 'completionDate'
          ? `${resources.tasks}/completed/by_completion_date`
          : `${resources.tasks}/completed/by_due_date`;

      const response = await this.callTodoistApi({
        resource: endpoint,
        method: Method.Get,
        query: {
          ...(request.projectId ? { project_id: request.projectId } : {}),
          ...(request.sectionId ? { section_id: request.sectionId } : {}),
          ...(request.limit ? { limit: request.limit } : {}),
          ...(request.cursor ? { cursor: request.cursor } : {}),
          ...(request.since ? { since: request.since } : {}),
          ...(request.until ? { until: request.until } : {}),
        },
      });
      return response.items.map((item: any) => ({
        id: item.id,
        taskId: item.task_id,
        content: item.content,
        projectId: item.project_id,
        sectionId: item.section_id,
        completedAt: item.completed_at,
        userId: item.user_id,
        note: item.note,
      }));
    },
    getTasksByFilter: async (request: GetTasksByFilterRequest): Promise<Task[]> => {
      if (!request.filter) {
        throw new TodoistError('filter is required to getTasksByFilter');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.tasks}/filter`,
        method: Method.Get,
        query: {
          filter: request.filter,
          ...(request.lang ? { lang: request.lang } : {}),
          ...(request.limit ? { limit: request.limit } : {}),
        },
      });
      return response.results.map((task: any) => ({
        id: task.id,
        content: task.content,
        description: task.description,
        projectId: task.project_id,
        sectionId: task.section_id,
        parentId: task.parent_id,
        order: task.order,
        priority: task.priority,
        due: task.due
          ? {
              date: task.due.date,
              isRecurring: task.due.is_recurring,
              datetime: task.due.datetime,
              string: task.due.string,
              timezone: task.due.timezone,
            }
          : undefined,
        labels: task.labels || [],
        assigneeId: task.assignee_id,
        assignerId: task.assigner_id,
        commentCount: task.comment_count,
        isCompleted: task.is_completed,
        createdAt: task.created_at,
        creatorId: task.creator_id,
        url: task.url,
        duration: task.duration
          ? {
              amount: task.duration.amount,
              unit: task.duration.unit,
            }
          : undefined,
      }));
    },
    quickAddTask: async (request: QuickAddTaskRequest): Promise<Task> => {
      if (!request.text) {
        throw new TodoistError('text is required to quickAddTask');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.tasks}/quick`,
        method: Method.Post,
        body: {
          text: request.text,
          ...(request.note ? { note: request.note } : {}),
          ...(request.reminder ? { reminder: request.reminder } : {}),
          ...(request.autoReminder !== undefined ? { auto_reminder: request.autoReminder } : {}),
        },
      });
      return {
        id: response.id,
        content: response.content,
        description: response.description,
        projectId: response.project_id,
        sectionId: response.section_id,
        parentId: response.parent_id,
        order: response.order,
        priority: response.priority,
        due: response.due
          ? {
              date: response.due.date,
              isRecurring: response.due.is_recurring,
              datetime: response.due.datetime,
              string: response.due.string,
              timezone: response.due.timezone,
            }
          : undefined,
        labels: response.labels || [],
        assigneeId: response.assignee_id,
        assignerId: response.assigner_id,
        commentCount: response.comment_count,
        isCompleted: response.is_completed,
        createdAt: response.created_at,
        creatorId: response.creator_id,
        url: response.url,
        duration: response.duration
          ? {
              amount: response.duration.amount,
              unit: response.duration.unit,
            }
          : undefined,
      };
    },
    reopenTask: async (taskId: string): Promise<Task> => {
      if (!taskId) {
        throw new TodoistError('taskId is required to reopenTask');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.tasks}/${taskId}/reopen`,
        method: Method.Post,
      });
      return {
        id: response.id,
        content: response.content,
        description: response.description,
        projectId: response.project_id,
        sectionId: response.section_id,
        parentId: response.parent_id,
        order: response.order,
        priority: response.priority,
        due: response.due
          ? {
              date: response.due.date,
              isRecurring: response.due.is_recurring,
              datetime: response.due.datetime,
              string: response.due.string,
              timezone: response.due.timezone,
            }
          : undefined,
        labels: response.labels || [],
        assigneeId: response.assignee_id,
        assignerId: response.assigner_id,
        commentCount: response.comment_count,
        isCompleted: response.is_completed,
        createdAt: response.created_at,
        creatorId: response.creator_id,
        url: response.url,
        duration: response.duration
          ? {
              amount: response.duration.amount,
              unit: response.duration.unit,
            }
          : undefined,
      };
    },
    closeTask: async (taskId: string): Promise<void> => {
      if (!taskId) {
        throw new TodoistError('taskId is required to closeTask');
      }

      await this.callTodoistApi({
        resource: `${resources.tasks}/${taskId}/close`,
        method: Method.Post,
      });
    },
    moveTask: async (request: MoveTaskRequest): Promise<void> => {
      if (!request.taskId) {
        throw new TodoistError('taskId is required to moveTask');
      }

      await this.callTodoistApi({
        resource: `${resources.tasks}/${request.taskId}/move`,
        method: Method.Post,
        body: {
          ...(request.projectId ? { project_id: request.projectId } : {}),
          ...(request.sectionId ? { section_id: request.sectionId } : {}),
          ...(request.parentId ? { parent_id: request.parentId } : {}),
        },
      });
    },
    updateTask: async (request: UpdateTaskRequest): Promise<Task> => {
      if (!request.taskId) {
        throw new TodoistError('taskId is required to updateTask');
      }

      const response = await this.callTodoistApi({
        resource: `${resources.tasks}/${request.taskId}`,
        method: Method.Post,
        body: {
          ...(request.content ? { content: request.content } : {}),
          ...(request.description ? { description: request.description } : {}),
          ...(request.labels ? { labels: request.labels } : {}),
          ...(request.priority !== undefined ? { priority: request.priority } : {}),
          ...(request.dueString ? { due_string: request.dueString } : {}),
          ...(request.dueDate ? { due_date: request.dueDate } : {}),
          ...(request.dueDatetime ? { due_datetime: request.dueDatetime } : {}),
          ...(request.dueLang ? { due_lang: request.dueLang } : {}),
          ...(request.assigneeId ? { assignee_id: request.assigneeId } : {}),
          ...(request.duration !== undefined ? { duration: request.duration } : {}),
          ...(request.durationUnit ? { duration_unit: request.durationUnit } : {}),
        },
      });
      return {
        id: response.id,
        content: response.content,
        description: response.description,
        projectId: response.project_id,
        sectionId: response.section_id,
        parentId: response.parent_id,
        order: response.order,
        priority: response.priority,
        due: response.due
          ? {
              date: response.due.date,
              isRecurring: response.due.is_recurring,
              datetime: response.due.datetime,
              string: response.due.string,
              timezone: response.due.timezone,
            }
          : undefined,
        labels: response.labels || [],
        assigneeId: response.assignee_id,
        assignerId: response.assigner_id,
        commentCount: response.comment_count,
        isCompleted: response.is_completed,
        createdAt: response.created_at,
        creatorId: response.creator_id,
        url: response.url,
        duration: response.duration
          ? {
              amount: response.duration.amount,
              unit: response.duration.unit,
            }
          : undefined,
      };
    },
    deleteTask: async (taskId: string): Promise<void> => {
      if (!taskId) {
        throw new TodoistError('taskId is required to deleteTask');
      }

      await this.callTodoistApi({
        resource: `${resources.tasks}/${taskId}`,
        method: Method.Delete,
      });
    },
  };
}
