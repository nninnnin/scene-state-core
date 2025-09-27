import { MeshRef, Transform } from "../command/types";
import { EntityId } from "../common";
import { Entity, State, Vec3 } from "./types";

export type ChangeSet = ReadonlySet<EntityId>;

type CheckTarget<T = unknown> = Record<EntityId, T>;

export function diff(
  prev: State,
  next: State,
): ChangeSet {
  const all = new Set<EntityId>();

  unionInto(all, diffEntities(prev, next));
  unionInto(all, diffTransform(prev, next));
  unionInto(all, diffMesh(prev, next));
  unionInto(all, diffMaterial(prev, next));

  return all;
}

export function diffEntities(
  prev: State,
  next: State,
): ReadonlySet<EntityId> {
  const out = new Set<EntityId>();

  checkDiff<Entity>(
    prev.entities,
    next.entities,
    (p, n, id) => p[id].name === n[id].name,
    out,
  );

  return out;
}

export function diffTransform(
  prev: State,
  next: State,
): ReadonlySet<EntityId> {
  const out = new Set<EntityId>();

  checkDiff<Transform>(
    (prev.components.transform ?? {}) as Record<
      EntityId,
      Transform
    >,
    (next.components.transform ?? {}) as Record<
      EntityId,
      Transform
    >,
    (p, n, id) => transformEquals(p[id], n[id]),
    out,
  );
  return out;
}

export function diffMesh(
  prev: State,
  next: State,
): ReadonlySet<EntityId> {
  const out = new Set<EntityId>();
  checkDiff<MeshRef>(
    prev.components.mesh ?? {},
    next.components.mesh ?? {},
    (p, n, id) => p[id] === n[id],
    out,
  );
  return out;
}

export function diffMaterial(
  prev: State,
  next: State,
): ReadonlySet<EntityId> {
  const out = new Set<EntityId>();
  checkDiff<MeshRef>(
    prev.components.material ?? {},
    next.components.material ?? {},
    (p, n, id) => p[id] === n[id],
    out,
  );
  return out;
}

export function changedEntity(
  id: EntityId,
  changes: ReadonlySet<EntityId>,
): boolean {
  return changes.has(id);
}

export function changedAny(
  ids: Iterable<EntityId>,
  changes: ReadonlySet<EntityId>,
): boolean {
  for (const id of ids)
    if (changes.has(id)) return true;
  return false;
}

export function collectChanges(
  prev: State,
  next: State,
) {
  const entities = diffEntities(prev, next);
  const transform = diffTransform(prev, next);
  const mesh = diffMesh(prev, next);
  const material = diffMaterial(prev, next);

  const all = new Set<EntityId>();
  unionInto(all, entities);
  unionInto(all, transform);
  unionInto(all, mesh);
  unionInto(all, material);

  return {
    all,
    entities,
    transform,
    mesh,
    material,
  } as const;
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
      !equalityChecker(prev, next, entityId)
    ) {
      // 값 변경
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

function vec3Equals(a: Vec3, b: Vec3): boolean {
  return (
    a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
  );
}

function transformEquals(
  a: Transform,
  b: Transform,
): boolean {
  return (
    vec3Equals(a.position, b.position) &&
    vec3Equals(a.rotation, b.rotation) &&
    vec3Equals(a.scale, b.scale)
  );
}

function unionInto<T>(
  target: Set<T>,
  src: ReadonlySet<T>,
) {
  for (const v of src) target.add(v);
}
