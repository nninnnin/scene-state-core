import { Migration } from "../types";
import {
  StateV2,
  StateV3,
} from "../validation/state.types";

export const m2_to_3: Migration = {
  from: 2,
  to: 3,
  apply(prev: StateV2): StateV3 {
    const filterEntityOriented = (
      map: Record<string, unknown>,
    ): Record<string, string> => {
      return Object.fromEntries(
        Object.entries(map).filter(
          ([entityId, value]) => {
            const hasEntityOriented =
              prev.entities[
                entityId
              ] !== undefined;
            const hasValidValue =
              typeof value === "string";

            return (
              hasEntityOriented &&
              hasValidValue
            );
          },
        ),
      ) as Record<string, string>;
    };

    const newState: StateV3 = {
      version: 3,
      entities: prev.entities,
      components: {
        transform:
          prev.components.transform,
        mesh: filterEntityOriented(
          (prev as any).components
            ?.mesh ?? {},
        ),
        material: filterEntityOriented(
          (prev as any).components
            ?.material ?? {},
        ),
      },
    };

    return newState;
  },
};
