import z from "zod";
import { z_v3 } from "../migration/validation/schema";

export type Vec3 = [
  number,
  number,
  number,
];

export interface Entity {
  name: string;
}

export type State = z.infer<
  typeof z_v3
>;

export const CURRENT_SCHEMA_VERSION = 3;

export function createEmptyState(): State {
  return {
    version: CURRENT_SCHEMA_VERSION,
    entities: {},
    components: {
      transform: {},
    },
  };
}
