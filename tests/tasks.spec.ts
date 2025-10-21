import { Todoist } from '../index';
import { TodoistError } from '../types';

describe('Todoist Tasks', () => {
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

  describe('getTasks', () => {
    it('should successfully get tasks by projectId', async () => {
      const mockResponse = [
        {
          id: 'task1',
          content: 'Task 1',
          projectId: 'project123',
        },
        {
          id: 'task2',
          content: 'Task 2',
          projectId: 'project123',
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const tasks = await todoist.tasks.getTasks({ projectId: 'project123' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks?projectId=project123', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(tasks).toEqual(mockResponse);
    });

    it('should successfully get tasks by sectionId', async () => {
      const mockResponse = [
        {
          id: 'task3',
          content: 'Task 3',
          sectionId: 'section456',
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const tasks = await todoist.tasks.getTasks({ sectionId: 'section456' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/tasks?sectionId=section456',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(tasks).toEqual(mockResponse);
    });

    it('should successfully get tasks by ids', async () => {
      const mockResponse = [
        {
          id: 'task1',
          content: 'Task 1',
        },
        {
          id: 'task2',
          content: 'Task 2',
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const tasks = await todoist.tasks.getTasks({
        ids: ['task1', 'task2'],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/tasks?ids=task1%2Ctask2',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(tasks).toEqual(mockResponse);
    });

    it('should throw error when all required parameters are missing', async () => {
      await expect(todoist.tasks.getTasks({})).rejects.toThrow(
        'At least one of projectId, sectionId, partentId or ids is required',
      );
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to fetch tasks' }),
      });

      await expect(todoist.tasks.getTasks({ projectId: 'project123' })).rejects.toThrow(TodoistError);
    });
  });

  describe('createTask', () => {
    it('should successfully create a task with minimal data', async () => {
      const mockResponse = {
        id: 'task123',
        content: 'Buy groceries',
        description: '',
        project_id: 'project123',
        section_id: null,
        parent_id: null,
        order: 1,
        priority: 1,
        labels: [],
        assignee_id: null,
        assigner_id: null,
        comment_count: 0,
        is_completed: false,
        created_at: '2024-01-01T00:00:00Z',
        creator_id: 'user123',
        url: 'https://todoist.com/showTask?id=task123',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const task = await todoist.tasks.createTask({ content: 'Buy groceries' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: 'Buy groceries' }),
      });

      expect(task).toEqual({
        id: 'task123',
        content: 'Buy groceries',
        description: '',
        projectId: 'project123',
        sectionId: null,
        parentId: null,
        order: 1,
        priority: 1,
        due: undefined,
        labels: [],
        assigneeId: null,
        assignerId: null,
        commentCount: 0,
        isCompleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        creatorId: 'user123',
        url: 'https://todoist.com/showTask?id=task123',
        duration: undefined,
      });
    });

    it('should successfully create a task with full data', async () => {
      const mockResponse = {
        id: 'task456',
        content: 'Complete project',
        description: 'Project description',
        project_id: 'project123',
        section_id: 'section456',
        parent_id: null,
        order: 2,
        priority: 4,
        due: {
          date: '2024-12-31',
          is_recurring: false,
          datetime: '2024-12-31T23:59:59Z',
          string: 'Dec 31',
          timezone: 'UTC',
        },
        labels: ['urgent', 'work'],
        assignee_id: 'user456',
        assigner_id: 'user123',
        comment_count: 0,
        is_completed: false,
        created_at: '2024-01-01T00:00:00Z',
        creator_id: 'user123',
        url: 'https://todoist.com/showTask?id=task456',
        duration: {
          amount: 30,
          unit: 'minute',
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const task = await todoist.tasks.createTask({
        content: 'Complete project',
        description: 'Project description',
        projectId: 'project123',
        sectionId: 'section456',
        priority: 4,
        labels: ['urgent', 'work'],
        dueDate: '2024-12-31',
        assigneeId: 'user456',
        duration: 30,
        durationUnit: 'minute',
      });

      expect(task.id).toBe('task456');
      expect(task.content).toBe('Complete project');
      expect(task.priority).toBe(4);
      expect(task.labels).toEqual(['urgent', 'work']);
      expect(task.due?.date).toBe('2024-12-31');
      expect(task.duration?.amount).toBe(30);
    });

    it('should throw error when content is missing', async () => {
      await expect(todoist.tasks.createTask({} as any)).rejects.toThrow('content is required to createTask');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to create task' }),
      });

      await expect(todoist.tasks.createTask({ content: 'Test task' })).rejects.toThrow(TodoistError);
    });
  });

  describe('getTaskById', () => {
    it('should successfully get a task by id', async () => {
      const mockResponse = {
        id: 'task123',
        content: 'Buy groceries',
        description: 'Weekly groceries',
        project_id: 'project123',
        section_id: 'section456',
        parent_id: null,
        order: 1,
        priority: 2,
        due: {
          date: '2024-01-15',
          is_recurring: false,
        },
        labels: ['shopping'],
        assignee_id: null,
        assigner_id: null,
        comment_count: 3,
        is_completed: false,
        created_at: '2024-01-01T00:00:00Z',
        creator_id: 'user123',
        url: 'https://todoist.com/showTask?id=task123',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const task = await todoist.tasks.getTaskById('task123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks/task123', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(task.id).toBe('task123');
      expect(task.content).toBe('Buy groceries');
      expect(task.commentCount).toBe(3);
    });

    it('should throw error when taskId is missing', async () => {
      await expect(todoist.tasks.getTaskById('')).rejects.toThrow('taskId is required to getTaskById');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Task not found' }),
      });

      await expect(todoist.tasks.getTaskById('task123')).rejects.toThrow(TodoistError);
    });
  });

  describe('getCompletedTasks', () => {
    it('should successfully get completed tasks by completion date', async () => {
      const mockResponse = {
        items: [
          {
            id: 'completion1',
            task_id: 'task123',
            content: 'Completed task 1',
            project_id: 'project123',
            section_id: 'section456',
            completed_at: '2024-01-15T10:00:00Z',
            user_id: 'user123',
            note: 'Task note',
          },
          {
            id: 'completion2',
            task_id: 'task456',
            content: 'Completed task 2',
            project_id: 'project123',
            section_id: null,
            completed_at: '2024-01-14T09:00:00Z',
            user_id: 'user123',
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const tasks = await todoist.tasks.getCompletedTasks({
        sortBy: 'completionDate',
        projectId: 'project123',
        limit: 10,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/tasks/completed/by_completion_date?project_id=project123&limit=10',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(tasks).toHaveLength(2);
      expect(tasks[0]?.taskId).toBe('task123');
      expect(tasks[0]?.completedAt).toBe('2024-01-15T10:00:00Z');
    });

    it('should successfully get completed tasks by due date', async () => {
      const mockResponse = {
        items: [
          {
            id: 'completion3',
            task_id: 'task789',
            content: 'Completed task 3',
            project_id: 'project123',
            section_id: null,
            completed_at: '2024-01-16T11:00:00Z',
            user_id: 'user123',
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const tasks = await todoist.tasks.getCompletedTasks({
        sortBy: 'dueDate',
        since: '2024-01-01',
        until: '2024-01-31',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/tasks/completed/by_due_date?since=2024-01-01&until=2024-01-31',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(tasks).toHaveLength(1);
      expect(tasks[0]?.taskId).toBe('task789');
    });

    it('should throw error when sortBy is missing', async () => {
      await expect(todoist.tasks.getCompletedTasks({} as any)).rejects.toThrow(
        'sortBy is required to getCompletedTasks',
      );
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to fetch completed tasks' }),
      });

      await expect(todoist.tasks.getCompletedTasks({ sortBy: 'completionDate' })).rejects.toThrow(TodoistError);
    });
  });

  describe('getTasksByFilter', () => {
    it('should successfully get tasks by filter', async () => {
      const mockResponse = {
        results: [
          {
            id: 'task123',
            content: 'Task with label',
            description: '',
            project_id: 'project123',
            section_id: null,
            parent_id: null,
            order: 1,
            priority: 1,
            labels: ['urgent'],
            assignee_id: null,
            assigner_id: null,
            comment_count: 0,
            is_completed: false,
            created_at: '2024-01-01T00:00:00Z',
            creator_id: 'user123',
            url: 'https://todoist.com/showTask?id=task123',
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const tasks = await todoist.tasks.getTasksByFilter({
        filter: '@urgent',
        limit: 20,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/tasks/filter?filter=%40urgent&limit=20',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(tasks).toHaveLength(1);
      expect(tasks[0]?.labels).toContain('urgent');
    });

    it('should throw error when filter is missing', async () => {
      await expect(todoist.tasks.getTasksByFilter({} as any)).rejects.toThrow('filter is required to getTasksByFilter');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Invalid filter' }),
      });

      await expect(todoist.tasks.getTasksByFilter({ filter: 'invalid' })).rejects.toThrow(TodoistError);
    });
  });

  describe('quickAddTask', () => {
    it('should successfully quick add a task', async () => {
      const mockResponse = {
        id: 'task789',
        content: 'Buy milk tomorrow',
        description: '',
        project_id: 'inbox',
        section_id: null,
        parent_id: null,
        order: 1,
        priority: 1,
        due: {
          date: '2024-01-16',
          is_recurring: false,
          string: 'tomorrow',
        },
        labels: [],
        assignee_id: null,
        assigner_id: null,
        comment_count: 0,
        is_completed: false,
        created_at: '2024-01-15T00:00:00Z',
        creator_id: 'user123',
        url: 'https://todoist.com/showTask?id=task789',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const task = await todoist.tasks.quickAddTask({
        text: 'Buy milk tomorrow',
        note: 'From grocery store',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks/quick', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Buy milk tomorrow',
          note: 'From grocery store',
        }),
      });

      expect(task.id).toBe('task789');
      expect(task.content).toBe('Buy milk tomorrow');
    });

    it('should throw error when text is missing', async () => {
      await expect(todoist.tasks.quickAddTask({} as any)).rejects.toThrow('text is required to quickAddTask');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to quick add task' }),
      });

      await expect(todoist.tasks.quickAddTask({ text: 'Test task' })).rejects.toThrow(TodoistError);
    });
  });

  describe('reopenTask', () => {
    it('should successfully reopen a task', async () => {
      const mockResponse = {
        id: 'task123',
        content: 'Reopened task',
        description: '',
        project_id: 'project123',
        section_id: null,
        parent_id: null,
        order: 1,
        priority: 1,
        labels: [],
        assignee_id: null,
        assigner_id: null,
        comment_count: 0,
        is_completed: false,
        created_at: '2024-01-01T00:00:00Z',
        creator_id: 'user123',
        url: 'https://todoist.com/showTask?id=task123',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const task = await todoist.tasks.reopenTask('task123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks/task123/reopen', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(task.id).toBe('task123');
      expect(task.isCompleted).toBe(false);
    });

    it('should throw error when taskId is missing', async () => {
      await expect(todoist.tasks.reopenTask('')).rejects.toThrow('taskId is required to reopenTask');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Task not found' }),
      });

      await expect(todoist.tasks.reopenTask('task123')).rejects.toThrow(TodoistError);
    });
  });

  describe('closeTask', () => {
    it('should successfully close a task', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
      });

      await todoist.tasks.closeTask('task123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks/task123/close', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });
    });

    it('should throw error when taskId is missing', async () => {
      await expect(todoist.tasks.closeTask('')).rejects.toThrow('taskId is required to closeTask');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Task not found' }),
      });

      await expect(todoist.tasks.closeTask('task123')).rejects.toThrow(TodoistError);
    });
  });

  describe('moveTask', () => {
    it('should successfully move a task to a different project', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
      });

      await todoist.tasks.moveTask({
        taskId: 'task123',
        projectId: 'project456',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks/task123/move', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: 'project456' }),
      });
    });

    it('should successfully move a task to a different section', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
      });

      await todoist.tasks.moveTask({
        taskId: 'task123',
        sectionId: 'section789',
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks/task123/move', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section_id: 'section789' }),
      });
    });

    it('should throw error when taskId is missing', async () => {
      await expect(todoist.tasks.moveTask({} as any)).rejects.toThrow('taskId is required to moveTask');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Invalid move operation' }),
      });

      await expect(todoist.tasks.moveTask({ taskId: 'task123', projectId: 'project456' })).rejects.toThrow(
        TodoistError,
      );
    });
  });

  describe('updateTask', () => {
    it('should successfully update a task', async () => {
      const mockResponse = {
        id: 'task123',
        content: 'Updated task content',
        description: 'Updated description',
        project_id: 'project123',
        section_id: null,
        parent_id: null,
        order: 1,
        priority: 3,
        labels: ['updated'],
        assignee_id: 'user456',
        assigner_id: null,
        comment_count: 0,
        is_completed: false,
        created_at: '2024-01-01T00:00:00Z',
        creator_id: 'user123',
        url: 'https://todoist.com/showTask?id=task123',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const task = await todoist.tasks.updateTask({
        taskId: 'task123',
        content: 'Updated task content',
        description: 'Updated description',
        priority: 3,
        labels: ['updated'],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/tasks/task123',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Bearer test-api-key',
            'Content-Type': 'application/json',
          },
        }),
      );

      // Verify the body contains the correct fields
      const callArgs = mockFetch.mock.calls[0][1];
      const bodyObj = JSON.parse(callArgs.body);
      expect(bodyObj).toEqual({
        content: 'Updated task content',
        description: 'Updated description',
        labels: ['updated'],
        priority: 3,
      });

      expect(task.id).toBe('task123');
      expect(task.content).toBe('Updated task content');
      expect(task.priority).toBe(3);
    });

    it('should throw error when taskId is missing', async () => {
      await expect(todoist.tasks.updateTask({} as any)).rejects.toThrow('taskId is required to updateTask');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Task not found' }),
      });

      await expect(todoist.tasks.updateTask({ taskId: 'task123', content: 'Updated' })).rejects.toThrow(TodoistError);
    });
  });

  describe('deleteTask', () => {
    it('should successfully delete a task', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
      });

      await todoist.tasks.deleteTask('task123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/tasks/task123', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });
    });

    it('should throw error when taskId is missing', async () => {
      await expect(todoist.tasks.deleteTask('')).rejects.toThrow('taskId is required to deleteTask');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Task not found' }),
      });

      await expect(todoist.tasks.deleteTask('task123')).rejects.toThrow(TodoistError);
    });
  });
});
