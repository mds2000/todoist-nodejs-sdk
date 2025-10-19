# Todoist Node.js SDK

[![npm version](https://badge.fury.io/js/todoist-nodejs-sdk.svg)](https://badge.fury.io/js/todoist-nodejs-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **🚧 Work in Progress**: This SDK is actively being developed and will be continuously updated to provide comprehensive coverage of the entire Todoist API. New endpoints and features are being added regularly. Check the [changelog](CHANGELOG.md) for the latest updates!

An unofficial, lightweight TypeScript/JavaScript SDK for integrating with the Todoist API in Node.js applications.

## Installation

```bash
npm install todoist-nodejs-sdk
```

## Quick Start

### 1. Get Your API Token

1. Go to [Todoist Settings](https://todoist.com/prefs/integrations)
2. Scroll down to "API token" and copy your token

### 2. Basic Usage

```typescript
import { Todoist } from 'todoist-nodejs-sdk';

// Initialize the SDK
const todoist = new Todoist({
  apiKey: 'your-api-token-here',
});

// Get all projects
const projects = await todoist.projects.getProjects();
console.log('Your projects:', projects);

// Get a specific project
const project = await todoist.projects.getProjectById('project-id');
console.log('Project details:', project);
```

## Usage Examples

### Project Management

```typescript
// Get all projects
const projects = await todoist.projects.getProjects();

// Get archived projects
const archivedProjects = await todoist.projects.getArchivedProjects();

// Create a new project
const newProject = await todoist.projects.createProject({
  name: 'My New Project',
  description: 'A project for organizing tasks',
  color: 'blue',
  isFavorite: true,
});

// Update a project
const updatedProject = await todoist.projects.updateProject({
  projectId: 'project-id',
  name: 'Updated Project Name',
  description: 'Updated description',
  isFavorite: false,
});

// Get project collaborators
const collaborators = await todoist.projects.getProjectColaborators({
  projectId: 'project-id',
});

// Get project permissions
const permissions = await todoist.projects.getProjectPermissions();
```

### Task Management

```typescript
// Get tasks by project
const tasks = await todoist.tasks.getTasks({
  projectId: 'project-id',
});

// Get tasks by section
const sectionTasks = await todoist.tasks.getTasks({
  sectionId: 'section-id',
});

// Get tasks by label
const labeledTasks = await todoist.tasks.getTasks({
  label: 'urgent',
});

// Get specific tasks by IDs
const specificTasks = await todoist.tasks.getTasks({
  ids: ['task-id-1', 'task-id-2'],
});
```

### Error Handling

```typescript
import { Todoist, TodoistError } from 'todoist-nodejs-sdk';

try {
  const projects = await todoist.projects.getProjects();
} catch (error) {
  if (error instanceof TodoistError) {
    console.error('Todoist API Error:', error.message);
    console.error('Cause:', error.cause);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## API Reference

### Todoist Class

The main class for interacting with the Todoist API.

#### Constructor

```typescript
new Todoist({ apiKey: string });
```

#### Methods

##### Projects

- `getProjects(request?: GetProjectsRequest): Promise<Project[]>`
- `getProjectById(projectId: string): Promise<Project>`
- `getArchivedProjects(request?: GetArchivedProjectsRequest): Promise<Project[]>`
- `getProjectColaborators(request: GetProjectColaboratorsRequest): Promise<ProjectColaborator[]>`
- `getProjectPermissions(): Promise<ProjectPermissions>`
- `createProject(request: CreateProjectRequest): Promise<Project>`
- `updateProject(request: UpdateProjectRequest): Promise<Project>`

##### Sections

- `getSections(request?: GetSectionsRequest): Promise<Section[]>`
- `createSection(request: CreateSectionRequest): Promise<Section>`

##### Tasks

- `getTasks(request: GetAllTasksRequest): Promise<Task[]>`

## TypeScript Support

This SDK is written in TypeScript and includes comprehensive type definitions:

```typescript
import {
  Todoist,
  Project,
  Task,
  CreateProjectRequest,
  UpdateProjectRequest,
  GetAllTasksRequest,
} from 'todoist-nodejs-sdk';
```

## Environment Variables

For security, store your API token in environment variables:

```bash
# .env file
TODOIST_API_KEY=your-api-token-here
```

```typescript
import { Todoist } from 'todoist-nodejs-sdk';

const todoist = new Todoist({
  apiKey: process.env.TODOIST_API_KEY!,
});
```

## Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports

Found a bug? Please create an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, etc.)

### 🚀 Feature Requests

Have an idea? We'd love to hear it! Please create an issue with:

- Clear description of the feature
- Use cases and examples
- Any implementation ideas

### 💻 Code Contributions

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**:
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### 📝 Development Setup

```bash
# Clone the repository
git clone https://github.com/mds2000/todoist-nodejs-sdk.git
cd todoist-nodejs-sdk

# Install dependencies
npm install

# Build the project
npm run build
```

### 🧪 Testing

```bash
# Run linting
npm run lint

# Build the project
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Matías da Silva** - [GitHub](https://github.com/mds2000)

## Support

- 📖 [Documentation](https://github.com/mds2000/todoist-nodejs-sdk#readme)
- 🐛 [Report Issues](https://github.com/mds2000/todoist-nodejs-sdk/issues)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

⭐ **Star this repository** if you find it helpful!
