import { Todoist } from '../index';
import { TodoistError } from '../types';

describe('Todoist Projects', () => {
  let todoist: Todoist;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    todoist = new Todoist({ apiKey: 'test-api-key' });
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getProjectById', () => {
    it('should successfully get a project by id', async () => {
      const mockProjectResponse = {
        id: '123',
        can_assign_tasks: true,
        child_order: 1,
        color: 'blue',
        creator_uid: 'user123',
        created_at: '2024-01-01T00:00:00Z',
        is_archived: false,
        is_deleted: false,
        is_favorite: true,
        is_frozen: false,
        name: 'Test Project',
        updated_at: '2024-01-01T00:00:00Z',
        view_style: 'list',
        default_order: 0,
        description: 'Test description',
        public_key: 'key123',
        role: 'owner',
        parent_id: null,
        inbox_project: false,
        is_collapsed: false,
        is_shared: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockProjectResponse,
      });

      const project = await todoist.projects.getProjectById('123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/projects/123', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(project).toEqual({
        id: '123',
        canAssignTasks: true,
        childOrder: 1,
        color: 'blue',
        creatorUid: 'user123',
        createdAt: '2024-01-01T00:00:00Z',
        isArchived: false,
        isDeleted: false,
        isFavorite: true,
        isFrozen: false,
        name: 'Test Project',
        updatedAt: '2024-01-01T00:00:00Z',
        viewStyle: 'list',
        defaultOrder: 0,
        description: 'Test description',
        publicKey: 'key123',
        role: 'owner',
        parentId: null,
        inboxProject: false,
        isCollapsed: false,
        isShared: false,
      });
    });

    it('should throw error when projectId is missing', async () => {
      await expect(todoist.projects.getProjectById('')).rejects.toThrow('projectId is required to getProjectById');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Project not found' }),
      });

      await expect(todoist.projects.getProjectById('123')).rejects.toThrow(TodoistError);
    });
  });

  describe('getProjects', () => {
    it('should successfully get all projects', async () => {
      const mockResponse = {
        results: [
          {
            id: '123',
            can_assign_tasks: true,
            child_order: 1,
            color: 'blue',
            creator_uid: 'user123',
            created_at: '2024-01-01T00:00:00Z',
            is_archived: false,
            is_deleted: false,
            is_favorite: true,
            is_frozen: false,
            name: 'Test Project',
            updated_at: '2024-01-01T00:00:00Z',
            view_style: 'list',
            default_order: 0,
            description: 'Test description',
            public_key: 'key123',
            role: 'owner',
            parent_id: null,
            inbox_project: false,
            is_collapsed: false,
            is_shared: false,
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const projects = await todoist.projects.getProjects();

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/projects', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(projects).toHaveLength(1);
      expect(projects[0]?.id).toBe('123');
      expect(projects[0]?.name).toBe('Test Project');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to fetch projects' }),
      });

      await expect(todoist.projects.getProjects()).rejects.toThrow(TodoistError);
    });
  });

  describe('getArchivedProjects', () => {
    it('should successfully get archived projects', async () => {
      const mockResponse = {
        results: [
          {
            id: '456',
            can_assign_tasks: false,
            child_order: 2,
            color: 'red',
            creator_uid: 'user456',
            created_at: '2023-01-01T00:00:00Z',
            is_archived: true,
            is_deleted: false,
            is_favorite: false,
            is_frozen: false,
            name: 'Archived Project',
            updated_at: '2023-06-01T00:00:00Z',
            view_style: 'board',
            default_order: 0,
            description: 'Archived description',
            public_key: 'key456',
            role: 'member',
            parent_id: null,
            inbox_project: false,
            is_collapsed: true,
            is_shared: true,
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const projects = await todoist.projects.getArchivedProjects({ limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/projects/archived?limit=10',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(projects).toHaveLength(1);
      expect(projects[0]?.isArchived).toBe(true);
      expect(projects[0]?.name).toBe('Archived Project');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to fetch archived projects' }),
      });

      await expect(todoist.projects.getArchivedProjects()).rejects.toThrow(TodoistError);
    });
  });

  describe('getProjectColaborators', () => {
    it('should successfully get project collaborators', async () => {
      const mockResponse = {
        results: [
          {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
          },
          {
            id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const collaborators = await todoist.projects.getProjectColaborators({
        projectId: '123',
        limit: 10,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/projects/123/collaborators?limit=10',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(collaborators).toHaveLength(2);
      expect(collaborators[0]?.name).toBe('John Doe');
      expect(collaborators[1]?.email).toBe('jane@example.com');
    });

    it('should throw error when projectId is missing', async () => {
      await expect(todoist.projects.getProjectColaborators({ projectId: '' })).rejects.toThrow(
        'projectId is required to getProjectColaborators',
      );
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Project not found' }),
      });

      await expect(todoist.projects.getProjectColaborators({ projectId: '123' })).rejects.toThrow(TodoistError);
    });
  });

  describe('getProjectPermissions', () => {
    it('should successfully get project permissions', async () => {
      const mockResponse = {
        project_collaborator_actions: [
          {
            name: 'CREATOR',
            actions: [{ name: 'edit' }, { name: 'delete' }],
          },
        ],
        workspace_collaborator_actions: [
          {
            name: 'ADMIN',
            actions: [{ name: 'manage' }],
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const permissions = await todoist.projects.getProjectPermissions();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/projects/permissions',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(permissions.projectCollaboratorActions).toHaveLength(1);
      expect(permissions.workspaceCollaboratorActions).toHaveLength(1);
      expect(permissions.projectCollaboratorActions[0]?.actions).toContain('edit');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to fetch permissions' }),
      });

      await expect(todoist.projects.getProjectPermissions()).rejects.toThrow(TodoistError);
    });
  });

  describe('createProject', () => {
    it('should successfully create a project', async () => {
      const mockResponse = {
        id: '789',
        can_assign_tasks: true,
        child_order: 1,
        color: 'green',
        creator_uid: 'user789',
        created_at: '2024-02-01T00:00:00Z',
        is_archived: false,
        is_deleted: false,
        is_favorite: false,
        is_frozen: false,
        name: 'New Project',
        updated_at: '2024-02-01T00:00:00Z',
        view_style: 'list',
        default_order: 0,
        description: 'New project description',
        public_key: 'key789',
        role: 'owner',
        parent_id: null,
        inbox_project: false,
        is_collapsed: false,
        is_shared: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const project = await todoist.projects.createProject({
        name: 'New Project',
        description: 'New project description',
        color: 'green',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/projects', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Project',
          description: 'New project description',
          color: 'green',
        }),
      });

      expect(project.id).toBe('789');
      expect(project.name).toBe('New Project');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to create project' }),
      });

      await expect(todoist.projects.createProject({ name: 'New Project' })).rejects.toThrow(TodoistError);
    });
  });

  describe('updateProject', () => {
    it('should successfully update a project', async () => {
      const mockResponse = {
        id: '123',
        can_assign_tasks: true,
        child_order: 1,
        color: 'purple',
        creator_uid: 'user123',
        created_at: '2024-01-01T00:00:00Z',
        is_archived: false,
        is_deleted: false,
        is_favorite: true,
        is_frozen: false,
        name: 'Updated Project',
        updated_at: '2024-03-01T00:00:00Z',
        view_style: 'board',
        default_order: 0,
        description: 'Updated description',
        public_key: 'key123',
        role: 'owner',
        parent_id: null,
        inbox_project: false,
        is_collapsed: false,
        is_shared: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const project = await todoist.projects.updateProject({
        projectId: '123',
        name: 'Updated Project',
        description: 'Updated description',
        color: 'purple',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/projects/123', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated Project',
          description: 'Updated description',
          color: 'purple',
        }),
      });

      expect(project.name).toBe('Updated Project');
      expect(project.color).toBe('purple');
    });

    it('should throw error when projectId is missing', async () => {
      await expect(todoist.projects.updateProject({ projectId: '', name: 'Test' })).rejects.toThrow(
        'projectId is required to updateProject',
      );
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to update project' }),
      });

      await expect(todoist.projects.updateProject({ projectId: '123', name: 'Updated' })).rejects.toThrow(TodoistError);
    });
  });
});
