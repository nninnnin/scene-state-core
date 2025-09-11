import { StateInvariant } from ".";
import { State } from "../types";

export const entityInvariants: StateInvariant[] =
  [
    // 1) Prevent entitiy name duplication
    (state: State) => {
      const names = new Set<string>();

      for (const id in state.entities) {
        const name =
          state.entities[id].name;

        if (names.has(name)) {
          throw new Error(
            `[Invariant] Duplicate entity name: ${name}`,
          );
        }

        names.add(name);
      }
    },
  ];
