export class ProjectLoadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectLoadingError";
  }
}

export function raiseProjectLoadingError(message: string): never {
  throw new ProjectLoadingError(message);
}
