const todoistUrl = "https://api.todoist.com/api/v1/";

export class Todoist {
  private readonly apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }
}
