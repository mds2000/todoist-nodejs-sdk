import { Todoist } from '../index';
import { TodoistError } from '../types';

describe('Todoist Class', () => {
  describe('Constructor', () => {
    it('should successfully initialize with valid API key', () => {
      const apiKey = 'valid-api-key';
      const todoist = new Todoist({ apiKey });

      expect(todoist).toBeInstanceOf(Todoist);
      expect(todoist.projects).toBeDefined();
      expect(todoist.sections).toBeDefined();
      expect(todoist.tasks).toBeDefined();
    });

    it('should throw TodoistError when apiKey is missing', () => {
      expect(() => {
        new Todoist({ apiKey: '' });
      }).toThrow(new TodoistError('Todoist apiKey is required'));
    });

    it('should throw TodoistError when apiKey is undefined', () => {
      expect(() => {
        new Todoist({ apiKey: undefined as any });
      }).toThrow(TodoistError);
    });

    it('should throw TodoistError when apiKey is null', () => {
      expect(() => {
        new Todoist({ apiKey: null as any });
      }).toThrow(TodoistError);
    });
  });

  describe('Public API', () => {
    let todoist: Todoist;

    beforeEach(() => {
      todoist = new Todoist({ apiKey: 'test-api-key' });
    });

    it('should expose projects namespace', () => {
      expect(todoist.projects).toBeDefined();
      expect(typeof todoist.projects.getProjectById).toBe('function');
      expect(typeof todoist.projects.getProjects).toBe('function');
      expect(typeof todoist.projects.getArchivedProjects).toBe('function');
      expect(typeof todoist.projects.getProjectColaborators).toBe('function');
      expect(typeof todoist.projects.getProjectPermissions).toBe('function');
      expect(typeof todoist.projects.createProject).toBe('function');
      expect(typeof todoist.projects.updateProject).toBe('function');
    });

    it('should expose sections namespace', () => {
      expect(todoist.sections).toBeDefined();
      expect(typeof todoist.sections.getSections).toBe('function');
      expect(typeof todoist.sections.createSection).toBe('function');
      expect(typeof todoist.sections.getSectionById).toBe('function');
    });

    it('should expose tasks namespace', () => {
      expect(todoist.tasks).toBeDefined();
      expect(typeof todoist.tasks.getTasks).toBe('function');
    });
  });
});
