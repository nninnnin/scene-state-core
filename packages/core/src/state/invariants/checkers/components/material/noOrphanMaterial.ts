import { InvariantChecker } from "../..";
import { State } from "../../../../types";
import { InvalidComponentError } from "../../../errors";
import { MaterialRef } from "../../../../../command/types";
import { EntityId } from "../../../../../common";

export const noOrphanMaterial: InvariantChecker =
  {
    id: "material.noOrhpan",
    onMaterialIteration(
      state: State,
      entityId: EntityId,
      _: MaterialRef,
    ) {
      const entity =
        state.entities[entityId];

      if (!entity) {
        throw new InvalidComponentError(
          entityId,
          "존재하지 않는 엔티티에 대한 머티리얼 레퍼런스가 존재합니다",
        );
      }
    },
  };
