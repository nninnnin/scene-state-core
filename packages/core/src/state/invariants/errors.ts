import { InvariantError } from "../../common/errors";

export class InvalidEntityError extends InvariantError {
  constructor(
    entityId: string,
    reason: string,
  ) {
    super(
      `Invalid entity ${entityId}: ${reason}`,
    );

    this.name = "InvalidEntityError";
  }
}

export class InvalidComponentError extends InvariantError {
  constructor(
    entityId: string,
    reason: string,
  ) {
    super(
      `Invalid component on ${entityId}: ${reason}`,
    );

    this.name = "InvalidComponentError";
  }
}
