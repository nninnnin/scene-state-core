import { InvariantChecker } from "..";
import { EntityId } from "../../../../common";
import {
  State,
  Entity,
} from "../../../types";

export const duplicatedEntityName: InvariantChecker =
  {
    id: "entity.uniqueName",
    onEntityIteration(
      state: State,
      _: EntityId,
      __: Entity,
    ) {
      const seen = new Set<string>();

      for (const e of Object.values(
        state.entities,
      )) {
        if (seen.has(e.name))
          throw new Error(
            "엔티티 이름 중복",
          );

        seen.add(e.name);
      }
    },
  };
