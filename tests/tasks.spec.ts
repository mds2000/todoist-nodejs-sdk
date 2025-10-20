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
});
