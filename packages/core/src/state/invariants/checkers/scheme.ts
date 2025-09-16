import { InvariantChecker } from ".";
import { Transform } from "../../../command/types";
import { EntityId } from "../../../common";
import {
  Entity,
  State,
} from "../../types";
import {
  InvalidEntityError,
  InvalidTransformError,
} from "../errors";

export const checkEntityShape: InvariantChecker =
  {
    id: "entities.shapeCheck",
    onEntityIteration(
      _: State,
      entityId: EntityId,
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
    },
  };

export const checkTransformShape: InvariantChecker =
  {
    id: "transform.shapeCheck",
    onTransformIteration(
      _: State,
      entityId: EntityId,
      transform: Transform,
    ) {
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
    },
  };

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
