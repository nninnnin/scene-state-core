import { Migration } from "../types";
import {
  StateV0,
  StateV1,
} from "../validation/state.types";

/**
 *
 * Migration from v0 to v1
 *
 * - Add version field
 * - Add transform value fallback
 *
 */
export const m0_to_1: Migration = {
  from: 0,
  to: 1,
  apply(state: StateV0): StateV1 {
    return {
      ...state,
      entities: state.entities ?? {},
      components: {
        ...state.components,
        transform:
          state.components?.transform ??
          {},
      },
      version: 1,
    };
  },
};
