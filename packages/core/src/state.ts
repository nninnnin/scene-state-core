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

export function addEntity(state: State, id: EntityId, name: string): State {
  return {
    ...state,
    entities: {
      ...state.entities,
      [id]: { name },
    },
  };
}
