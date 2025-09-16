import { Transform } from "../../command/types";
import { EntityId } from "../../common";
import { Vec3 } from "../../state";
import { DEFAULT_TRANSFORM } from "../../transform";

import { Migration } from "../types";

/**
 *
 * Migration from v1 to v2
 *
 * - Sanitize transform value
 *   - Remove orphan transforms
 *   - Ensure every transform(position, rotation, scale) values
 *
 */

export const m1_to_2: Migration = {
  from: 1,
  to: 2,
  apply(state) {
    const newState = { ...state };

    const entities =
      newState.entities ?? {};
    const transform =
      newState.components?.transform ??
      {};

    // 1) Remove Orphan transforms
    const newTransform: Record<
      EntityId,
      Transform
    > = Object.keys(transform).reduce(
      (newTransform, entityId) => {
        const hasEntity =
          entities[entityId];
        if (hasEntity)
          newTransform[entityId] =
            transform[entityId];

        return newTransform;
      },
      {} as Record<EntityId, Transform>,
    );

    // 2) Ensure every transform values
    for (const entityId of Object.keys(
      entities,
    )) {
      const entityTransform =
        newTransform[entityId] ??
        DEFAULT_TRANSFORM;

      newTransform[entityId] = {
        position: sanitizeVector3(
          entityTransform.position,
          DEFAULT_TRANSFORM.position,
        ),
        rotation: sanitizeVector3(
          entityTransform.rotation,
          DEFAULT_TRANSFORM.rotation,
        ),
        scale: sanitizeVector3(
          entityTransform.scale,
          DEFAULT_TRANSFORM.scale,
          1, // zero replacement
        ),
      };
    }

    return {
      ...newState,
      components: {
        ...(newState.components ?? {}),
        transform: newTransform,
      },
      version: 2,
    };
  },
};

function isFiniteNum(value: number) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function sanitizeVector3(
  input: unknown,
  defaultVector: Vec3,
  zeroReplacement?: number,
): Vec3 {
  const vector = Array.isArray(input)
    ? input
    : defaultVector;

  const [inputX, inputY, inputZ] =
    vector;
  const [defaultX, defaultY, defaultZ] =
    defaultVector;

  const x = isFiniteNum(inputX)
    ? inputX
    : defaultX;
  const y = isFiniteNum(inputY)
    ? inputY
    : defaultY;
  const z = isFiniteNum(inputZ)
    ? inputZ
    : defaultZ;

  const sanitized: Vec3 = [x, y, z];

  return zeroReplacement
    ? (sanitized.map((el) =>
        el === 0 ? zeroReplacement : el,
      ) as Vec3)
    : sanitized;
}
