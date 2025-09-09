export type EntityId = string;

export interface Entity {
  name: string;
}

export interface State {
  entities: Record<EntityId, Entity>;
}

export function createEmptyState(): State {
  return { entities: {} };
}

export function removeEntity(state: State, id: EntityId): State {
  const hasEntityId = Boolean(state.entities[id]);
  if (!hasEntityId) return state;

  const updatedEntities = Object.fromEntries(
    Object.entries(state.entities).filter(([entityId]) => entityId !== id),
  );

  return {
    ...state,
    entities: updatedEntities,
  };
}

export function addEntity(state: State, id: EntityId, name: string): State {
  return {
    ...state,
    entities: {
      ...state.entities,
      [id]: { name },
    },
  };
}
