export class EntityNotFoundError extends Error {
  constructor(id: string) {
    super(`Entity not found: ${id}`);

    this.name = 'EntityNotFoundError';
  }
}
