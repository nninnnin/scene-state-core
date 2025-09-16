import { Transform } from "../command/types";
import { EntityId } from "../common";

export type Vec3 = [
  number,
  number,
  number,
];

export interface Entity {
  name: string;
}

export interface State {
  version: number;
  entities: Record<EntityId, Entity>;
  components: {
    transform: Record<
      EntityId,
      Transform
    >;
  };
}

export const CURRENT_SCHEMA_VERSION = 2;

export function createEmptyState(): State {
  return {
    version: CURRENT_SCHEMA_VERSION,
    entities: {},
    components: { transform: {} },
  };
}
