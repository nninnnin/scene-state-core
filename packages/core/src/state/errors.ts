import { InvariantError } from "../common/errors";

export class DuplicateEntityError extends InvariantError {
  constructor(id: string) {
    super(
      `Entity Duplicated: ${id} is already added`,
    );

    this.name = "DuplicateEntityError";
  }
}
