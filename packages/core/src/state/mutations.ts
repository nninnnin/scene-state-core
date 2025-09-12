import { State } from "./types";
import { EntityId } from "../common";
import { validateState } from "./invariants";
import { DuplicateEntityError } from "./errors";

export function addEntity(
  state: State,
  id: EntityId,
  name: string,
): State {
  const hasAlready = state.entities[id];

  if (hasAlready) {
    throw new DuplicateEntityError(id);
  }

  const next = {
    ...state,
    entities: {
      ...state.entities,
      [id]: { name },
    },
  };

  validateState(next);

  return next;
}

export function removeEntity(
  state: State,
  id: EntityId,
): State {
  const hasEntityId = Boolean(
    state.entities[id],
  );
  if (!hasEntityId) return state;

  const {
    [id]: _omit,
    ...restEntities
  } = state.entities;

  const {
    [id]: _omitT,
    ...restTransforms
  } = state.components.transform;

  const next: State = {
    ...state,
    entities: restEntities,
    components: {
      ...state.components,
      transform: restTransforms,
    },
  };

  validateState(next);

  return next;
}
