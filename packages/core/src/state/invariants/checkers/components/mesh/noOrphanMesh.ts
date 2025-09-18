import { InvariantChecker } from "../..";
import { State } from "../../../../types";
import { InvalidComponentError } from "../../../errors";
import { MeshRef } from "../../../../../command/types";
import { EntityId } from "../../../../../common";

export const noOrphanMesh: InvariantChecker =
  {
    id: "mesh.noOrhpan",
    onMeshIteration(
      state: State,
      entityId: EntityId,
      _: MeshRef,
    ) {
      const entity =
        state.entities[entityId];

      if (!entity) {
        throw new InvalidComponentError(
          entityId,
          "존재하지 않는 엔티티에 대한 메쉬 레퍼런스가 존재합니다",
        );
      }
    },
  };
