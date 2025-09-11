export class InvariantError extends Error {
  constructor(message: string) {
    super(
      `[Invariant Error] ${message}`,
    );

    this.name = new.target.name;
  }
}

export class EntityNotFoundError extends InvariantError {
  constructor(id: string) {
    super(`Entity not found: ${id}`);

    this.name = "EntityNotFoundError";
  }
}
