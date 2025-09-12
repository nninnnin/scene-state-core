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

export class InvalidTransformError extends InvariantError {
  constructor(
    entityId: string,
    reason: string,
  ) {
    super(
      `Invalid transform on ${entityId}: ${reason}`,
    );

    this.name = "InvalidTransformError";
  }
}
