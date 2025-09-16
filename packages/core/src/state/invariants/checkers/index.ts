import {
  Entity,
  State,
} from "../../types";
import { EntityId } from "../../../common";
import { Transform } from "../../../command/types";

export type InvariantChecker = {
  id: string;
  onEntityIteration?: (
    state: State,
    entityId: EntityId,
    entity: Entity,
  ) => void;
  onTransformIteration?: (
    state: State,
    entityId: EntityId,
    transform: Transform,
  ) => void;
  onLoad?: (state: State) => void;
};
