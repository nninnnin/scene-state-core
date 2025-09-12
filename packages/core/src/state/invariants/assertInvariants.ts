import { State } from "../types";
import {
  checkEntityShape,
  checkTransformShape,
} from "./checkers/scheme";
import { InvalidTransformError } from "./errors";

export function assertInvariants(
  state: State,
): State {
  // 엔티티 형상 검사
  for (const [
    entityId,
    entity,
  ] of Object.entries(state.entities)) {
    checkEntityShape(entityId, entity);
  }

  // 트랜스폼 형상 검사
  const transforms =
    state.components.transform ?? {};
  for (const [
    entityId,
    transform,
  ] of Object.entries(transforms)) {
    if (!state.entities[entityId]) {
      throw new InvalidTransformError(
        entityId,
        "transform exists for non-existent entity",
      );
    }

    checkTransformShape(
      entityId,
      transform,
    );
  }

  return state;
}
