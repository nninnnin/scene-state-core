import z from "zod";
import { z_v2 } from "../migration/validation/schema";

export type Vec3 = [
  number,
  number,
  number,
];

export interface Entity {
  name: string;
}

export type State = z.infer<
  typeof z_v2
>;

export const CURRENT_SCHEMA_VERSION = 2;

export function createEmptyState(): State {
  return {
    version: CURRENT_SCHEMA_VERSION,
    entities: {},
    components: {
      transform: {},
    },
  };
}
