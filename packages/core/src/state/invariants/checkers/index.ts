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
  onMeshIteration?: (
    state: State,
    entityId: EntityId,
    meshRef: string,
  ) => void;
  onMaterialIteration?: (
    state: State,
    entityId: EntityId,
    materialRef: string,
  ) => void;
  onLoad?: (state: State) => void;
};
