import { Migration } from "../types";

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
  apply(state) {
    return {
      ...state,
      components: {
        ...state.components,
        trasnform:
          state.components?.transform ??
          {},
      },
      version: 1,
    };
  },
};
