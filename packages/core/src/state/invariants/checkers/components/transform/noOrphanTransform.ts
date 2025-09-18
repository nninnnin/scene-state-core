import { InvariantChecker } from "../..";
import { State } from "../../../../types";
import { InvalidComponentError } from "../../../errors";
import { Transform } from "../../../../../command/types";
import { EntityId } from "../../../../../common";

export const noOrphanTransform: InvariantChecker =
  {
    id: "transform.noOrhpan",
    onTransformIteration(
      state: State,
      entityId: EntityId,
      _: Transform,
    ) {
      const entity =
        state.entities[entityId];

      if (!entity) {
        throw new InvalidComponentError(
          entityId,
          "존재하지 않는 엔티티에 대한 트랜스폼이 존재합니다",
        );
      }
    },
  };
