import { StateInvariant } from "..";
import { DuplicateEntityError } from "../../errors";
import { State } from "../../types";

export const entityInvariants: StateInvariant[] =
  [
    // 1) Prevent entitiy name duplication
    (state: State) => {
      const names = new Set<string>();

      for (const entityId in state.entities) {
        const name =
          state.entities[entityId].name;

        if (names.has(name)) {
          throw new DuplicateEntityError(
            entityId,
          );
        }

        names.add(name);
      }
    },
  ];
