import {
  MeshRef,
  Transform,
} from "../command/types";
import { EntityId } from "../common";
import {
  Entity,
  State,
  Vec3,
} from "./types";

export type ChangeSet =
  ReadonlySet<EntityId>;

type CheckTarget<T = unknown> = Record<
  EntityId,
  T
>;

export function diff(
  prev: State,
  next: State,
) {
  let changeMemo = new Set<EntityId>();

  (function checkEntitiesDiff() {
    return checkDiff<Entity>(
      prev.entities,
      next.entities,
      (prev, next, entityId) =>
        prev[entityId].name ===
        next[entityId].name,
      changeMemo,
    );
  })();

  (function checkTransformDiff() {
    checkDiff<Transform>(
      prev.components.transform,
      next.components.transform,
      (prevTr, nextTr, entityId) =>
        transformEquals(
          prevTr[entityId],
          nextTr[entityId],
        ),
      changeMemo,
    );
  })();

  (function checkMeshDiff() {
    checkDiff<MeshRef>(
      prev.components.mesh ?? {},
      next.components.mesh ?? {},
      (prevMesh, nextMesh, entityId) =>
        prevMesh[entityId] ===
        nextMesh[entityId],
      changeMemo,
    );
  });

  (function checkMaterialDiff() {
    checkDiff<MeshRef>(
      prev.components.material ?? {},
      next.components.material ?? {},
      (
        prevMaterial,
        nextMaterial,
        entityId,
      ) =>
        prevMaterial[entityId] ===
        nextMaterial[entityId],
      changeMemo,
    );
  });

  return changeMemo;
}

function checkDiff<TargetValue>(
  prev: CheckTarget<TargetValue>,
  next: CheckTarget<TargetValue>,
  equalityChecker: (
    prev: CheckTarget<TargetValue>,
    next: CheckTarget<TargetValue>,
    entityId: EntityId,
  ) => boolean,
  changeMemo: Set<EntityId>,
) {
  // iterate prev
  for (const entityId in prev) {
    if (!(entityId in next)) {
      // next에서는 없는 경우 (삭제)
      changeMemo.add(entityId);
    } else if (
      equalityChecker(
        prev,
        next,
        entityId,
      )
    ) {
      // next에 있긴 있지만 not equal (변경)
      changeMemo.add(entityId);
    }
  }

  // iterate next
  for (const entityId in next) {
    if (!(entityId in prev)) {
      // prev에는 없는 경우 (추가)
      changeMemo.add(entityId);
    }
  }

  return changeMemo;
}

function vec3Equals(
  a: Vec3,
  b: Vec3,
): boolean {
  return (
    a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2]
  );
}

function transformEquals(
  a: Transform,
  b: Transform,
): boolean {
  return (
    vec3Equals(
      a.position,
      b.position,
    ) &&
    vec3Equals(
      a.rotation,
      b.rotation,
    ) &&
    vec3Equals(a.scale, b.scale)
  );
}
