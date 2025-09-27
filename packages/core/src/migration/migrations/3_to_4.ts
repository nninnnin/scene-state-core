import { Migration } from "../types";
import {
  StateV3,
  StateV4,
} from "../validation/state.types";

export const m3_to_4: Migration = {
  from: 3,
  to: 4,
  apply(prev: StateV3): StateV4 {
    const newState: StateV4 = {
      version: 4,
      entities: { ...prev.entities },
      components: {
        ...prev.components,
      },
    };

    return newState;
  },
};
