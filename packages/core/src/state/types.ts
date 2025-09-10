import { EntityId } from '../common';
import { Transform } from '../transform/types';

export interface Entity {
  name: string;
}

export interface State {
  entities: Record<EntityId, Entity>;
  components: {
    transform: Record<EntityId, Transform>;
  };
}
