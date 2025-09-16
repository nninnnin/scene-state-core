import z from "zod";

import {
  z_v0,
  z_v1,
  z_v2,
} from "./schema";

export type StateV0 = z.infer<
  typeof z_v0
> & { version?: 0 | undefined };

export type StateV1 = z.infer<
  typeof z_v1
>;

export type StateV2 = z.infer<
  typeof z_v2
>;

export type VersionedInput =
  | StateV0
  | StateV1
  | StateV2;
