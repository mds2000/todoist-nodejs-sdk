import { Todoist } from '../index';
import { TodoistError } from '../types';

describe('Todoist Sections', () => {
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

  describe('getSections', () => {
    it('should successfully get all sections', async () => {
      const mockResponse = {
        results: [
          {
            id: 'section1',
            name: 'To Do',
            project_id: 'project123',
            order: 1,
            is_collapsed: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'section2',
            name: 'In Progress',
            project_id: 'project123',
            order: 2,
            is_collapsed: false,
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const sections = await todoist.sections.getSections({ projectId: 'project123' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/sections?projectId=project123', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(sections).toHaveLength(2);
      expect(sections[0]?.id).toBe('section1');
      expect(sections[0]?.name).toBe('To Do');
      expect(sections[0]?.projectId).toBe('project123');
      expect(sections[0]?.isCollapsed).toBe(false);
      expect(sections[1]?.name).toBe('In Progress');
    });

    it('should get sections without query parameters', async () => {
      const mockResponse = {
        results: [],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const sections = await todoist.sections.getSections();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.todoist.com/api/v1/sections',
        expect.objectContaining({
          method: 'GET',
        }),
      );

      expect(sections).toHaveLength(0);
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to fetch sections' }),
      });

      await expect(todoist.sections.getSections()).rejects.toThrow(TodoistError);
    });
  });

  describe('createSection', () => {
    it('should successfully create a section', async () => {
      const mockResponse = {
        id: 'section123',
        name: 'New Section',
        user_id: 'user123',
        project_id: 'project456',
        section_order: 3,
        is_collapsed: false,
        added_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
        archived_at: null,
        is_archived: false,
        is_deleted: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const section = await todoist.sections.createSection({
        name: 'New Section',
        projectId: 'project456',
        order: 3,
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/sections', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Section',
          project_id: 'project456',
          order: 3,
        }),
      });

      expect(section.id).toBe('section123');
      expect(section.name).toBe('New Section');
      expect(section.userId).toBe('user123');
      expect(section.projectId).toBe('project456');
      expect(section.sectionOrder).toBe(3);
      expect(section.isArchived).toBe(false);
    });

    it('should create section without optional order', async () => {
      const mockResponse = {
        id: 'section456',
        name: 'Another Section',
        user_id: 'user123',
        project_id: 'project789',
        section_order: 1,
        is_collapsed: false,
        added_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
        archived_at: null,
        is_archived: false,
        is_deleted: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const section = await todoist.sections.createSection({
        name: 'Another Section',
        projectId: 'project789',
      });

      expect(section.name).toBe('Another Section');
    });

    it('should throw error when name is missing', async () => {
      await expect(todoist.sections.createSection({ name: '', projectId: 'project123' })).rejects.toThrow(
        'name is required to createSection',
      );
    });

    it('should throw error when projectId is missing', async () => {
      await expect(todoist.sections.createSection({ name: 'Test Section', projectId: '' })).rejects.toThrow(
        'projectId is required to createSection',
      );
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Failed to create section' }),
      });

      await expect(
        todoist.sections.createSection({
          name: 'Test',
          projectId: 'project123',
        }),
      ).rejects.toThrow(TodoistError);
    });
  });

  describe('getSectionById', () => {
    it('should successfully get a section by id', async () => {
      const mockResponse = {
        id: 'section789',
        name: 'Specific Section',
        user_id: 'user456',
        project_id: 'project123',
        section_order: 2,
        is_collapsed: true,
        added_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z',
        archived_at: null,
        is_archived: false,
        is_deleted: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const section = await todoist.sections.getSectionById('section789');

      expect(mockFetch).toHaveBeenCalledWith('https://api.todoist.com/api/v1/sections/section789', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: undefined,
      });

      expect(section.id).toBe('section789');
      expect(section.name).toBe('Specific Section');
      expect(section.userId).toBe('user456');
      expect(section.projectId).toBe('project123');
      expect(section.sectionOrder).toBe(2);
      expect(section.isCollapsed).toBe(true);
      expect(section.addedAt).toBe('2024-01-15T00:00:00Z');
      expect(section.updatedAt).toBe('2024-01-20T00:00:00Z');
    });

    it('should throw error when sectionId is missing', async () => {
      await expect(todoist.sections.getSectionById('')).rejects.toThrow('sectionId is required to getSectionById');
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Section not found' }),
      });

      await expect(todoist.sections.getSectionById('section789')).rejects.toThrow(TodoistError);
    });
  });
});
