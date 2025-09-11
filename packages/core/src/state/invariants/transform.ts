import { StateInvariant } from ".";
import { State } from "../types";

// 트랜스폼 관련 불변식 모음
export const transformInvariants: StateInvariant[] =
  [
    // 1) 존재하지 않는 엔티티에 Transform 금지
    (state: State) => {
      for (const entityId in state
        .components.transform) {
        const entity =
          state.entities[entityId];

        if (!entity) {
          throw new Error(
            `[Invariant] Transform exists for non-existent entity: "${entityId}"`,
          );
        }
      }
    },
  ];
