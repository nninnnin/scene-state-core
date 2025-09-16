import { Transform } from "../command/types";
import { EntityId } from "../common";
import { EntityNotFoundError } from "../common/errors";
import {
  State,
  assertInvariants,
} from "../state";

export const DEFAULT_TRANSFORM = {
  position: [0, 0, 0] as [
    number,
    number,
    number,
  ],
  rotation: [0, 0, 0] as [
    number,
    number,
    number,
  ],
  scale: [1, 1, 1] as [
    number,
    number,
    number,
  ],
};

// function overloads
export function setTransform(
  state: State,
  id: EntityId,
  t: Transform,
): State;
export function setTransform(
  state: State,
  id: EntityId,
  patch: Partial<Transform>,
): State;

export function setTransform(
  state: State,
  id: EntityId,
  input: Transform | Partial<Transform>,
): State {
  if (!state.entities[id]) {
    throw new EntityNotFoundError(id);
  }

  const prevTransform =
    state.components.transform[id] ??
    DEFAULT_TRANSFORM;

  const hasPartialInput = !(
    "position" in input &&
    "rotation" in input &&
    "scale" in input
  );

  const nextTransform: Transform =
    hasPartialInput
      ? {
          position:
            input.position ??
            prevTransform.position,
          rotation:
            input.rotation ??
            prevTransform.rotation,
          scale:
            input.scale ??
            prevTransform.scale,
        }
      : (input as Transform);

  const next: State = {
    ...state,
    components: {
      ...state.components,
      transform: {
        ...state.components.transform,
        [id]: nextTransform,
      },
    },
  };

  assertInvariants("onupdate")(next);

  return next;
}
