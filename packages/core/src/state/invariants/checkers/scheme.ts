import { Transform } from "../../../transform/types";
import { Entity } from "../../types";
import {
  InvalidEntityError,
  InvalidTransformError,
} from "../errors";

export function checkEntityShape(
  entityId: string,
  entity: Entity,
) {
  if (
    entity == null ||
    typeof entity !== "object"
  ) {
    throw new InvalidEntityError(
      entityId,
      "entity must be a non-null object",
    );
  }

  const name = entity.name;

  if (
    typeof name !== "string" ||
    name.length === 0
  ) {
    throw new InvalidEntityError(
      entityId,
      "missing or invalid 'name' field",
    );
  }
}

export function checkTransformShape(
  entityId: string,
  transform: Transform,
): void {
  for (const transformEl in transform) {
    const isValidVector3 = isVec3(
      transform[
        transformEl as keyof typeof transform
      ],
    );

    if (!isValidVector3) {
      throw new InvalidTransformError(
        entityId,
        `${transformEl} must be vec3`,
      );
    }
  }
}

function isVec3(vector: unknown) {
  const isArray = Array.isArray(vector);

  return (
    isArray &&
    vector.length === 3 &&
    vector.every(
      (number) =>
        typeof number === "number" &&
        Number.isFinite(number),
    )
  );
}
