import { EntityId } from '../common';
import { State } from '../state';
import { EntityNotFoundError } from './errors';
import { Transform } from './types';

export const DEFAULT_TRANSFORM = {
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: [1, 1, 1] as [number, number, number],
};

export function setTransform(state: State, id: EntityId, t: Transform): State {
  if (!state.entities[id]) {
    throw new EntityNotFoundError(id);
  }

  return {
    ...state,
    components: {
      ...state.components,
      transform: {
        ...state.components.transform,
        [id]: t,
      },
    },
  };
}
