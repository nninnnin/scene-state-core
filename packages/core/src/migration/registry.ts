import { m0_to_1 } from "./migrations/0_to_1";
import { m1_to_2 } from "./migrations/1_to_2";
import { m2_to_3 } from "./migrations/2_to_3";
import type { Migration } from "./types";

export const MIGRATIONS: Migration[] = [
  m0_to_1,
  m1_to_2,
  m2_to_3,
];
