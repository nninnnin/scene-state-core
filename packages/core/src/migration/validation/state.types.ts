import z from "zod";

import {
  z_v0,
  z_v1,
  z_v2,
} from "./schema";
import { Entity } from "../../state";
import { EntityId } from "../../common";
import { Transform } from "../../command/types";

export type StateV0 = z.infer<
  typeof z_v0
>;

export type StateV1 = z.infer<
  typeof z_v1
>;

export type StateV2 = z.infer<
  typeof z_v2
>;

export type VersionedStates =
  | StateV0
  | StateV1
  | StateV2;

export type ParsedV0 = {
  version: 0;
  entities: Record<EntityId, Entity>;
  components: {
    transform: Record<
      EntityId,
      Transform
    >;
  };
};

export type VersionedInput =
  | ParsedV0 // parsed as through `parseVersioned`
  | StateV1
  | StateV2;
