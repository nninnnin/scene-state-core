import { curry } from 'es-toolkit';

// src/state/types.ts
var CURRENT_SCHEMA_VERSION = 3;
function createEmptyState() {
  return {
    version: CURRENT_SCHEMA_VERSION,
    entities: {},
    components: {
      transform: {}
    }
  };
}

// src/state/invariants/checkers/entity/duplicatedEntityName.ts
var duplicatedEntityName = {
  id: "entity.uniqueName",
  onEntityIteration(state, _, __) {
    const seen = /* @__PURE__ */ new Set();
    for (const e of Object.values(
      state.entities
    )) {
      if (seen.has(e.name))
        throw new Error(
          "\uC5D4\uD2F0\uD2F0 \uC774\uB984 \uC911\uBCF5"
        );
      seen.add(e.name);
    }
  }
};

// src/common/errors.ts
var InvariantError = class extends Error {
  constructor(message) {
    super(
      `[Invariant Error] ${message}`
    );
    this.name = new.target.name;
  }
};
var EntityNotFoundError = class extends InvariantError {
  constructor(id) {
    super(`Entity not found: ${id}`);
    this.name = "EntityNotFoundError";
  }
};

// src/state/invariants/errors.ts
var InvalidComponentError = class extends InvariantError {
  constructor(entityId, reason) {
    super(
      `Invalid component on ${entityId}: ${reason}`
    );
    this.name = "InvalidComponentError";
  }
};

// src/state/invariants/checkers/components/transform/noOrphanTransform.ts
var noOrphanTransform = {
  id: "transform.noOrhpan",
  onTransformIteration(state, entityId, _) {
    const entity = state.entities[entityId];
    if (!entity) {
      throw new InvalidComponentError(
        entityId,
        "\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uC5D4\uD2F0\uD2F0\uC5D0 \uB300\uD55C \uD2B8\uB79C\uC2A4\uD3FC\uC774 \uC874\uC7AC\uD569\uB2C8\uB2E4"
      );
    }
  }
};

// src/state/invariants/checkers/components/mesh/noOrphanMesh.ts
var noOrphanMesh = {
  id: "mesh.noOrhpan",
  onMeshIteration(state, entityId, _) {
    const entity = state.entities[entityId];
    if (!entity) {
      throw new InvalidComponentError(
        entityId,
        "\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uC5D4\uD2F0\uD2F0\uC5D0 \uB300\uD55C \uBA54\uC26C \uB808\uD37C\uB7F0\uC2A4\uAC00 \uC874\uC7AC\uD569\uB2C8\uB2E4"
      );
    }
  }
};

// src/state/invariants/checkers/components/material/noOrphanMaterial.ts
var noOrphanMaterial = {
  id: "material.noOrhpan",
  onMaterialIteration(state, entityId, _) {
    const entity = state.entities[entityId];
    if (!entity) {
      throw new InvalidComponentError(
        entityId,
        "\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294 \uC5D4\uD2F0\uD2F0\uC5D0 \uB300\uD55C \uBA38\uD2F0\uB9AC\uC5BC \uB808\uD37C\uB7F0\uC2A4\uAC00 \uC874\uC7AC\uD569\uB2C8\uB2E4"
      );
    }
  }
};

// src/state/invariants/registry.ts
var registries = {
  onupdate: [
    duplicatedEntityName,
    noOrphanTransform,
    noOrphanMesh,
    noOrphanMaterial
  ],
  onload: [
    duplicatedEntityName,
    noOrphanTransform,
    noOrphanMesh,
    noOrphanMaterial
  ]
};

// src/state/invariants/index.ts
var assertInvariants = curry(
  function(mode, state) {
    const registry = registries[mode];
    for (const [
      entityId,
      entity
    ] of Object.entries(
      state.entities
    )) {
      for (const checker of registry) {
        checker.onEntityIteration && checker.onEntityIteration(
          state,
          entityId,
          entity
        );
      }
    }
    for (const [
      entityId,
      transform
    ] of Object.entries(
      state.components.transform
    )) {
      for (const checker of registry) {
        checker.onTransformIteration && checker.onTransformIteration(
          state,
          entityId,
          transform
        );
      }
    }
    for (const [
      entityId,
      mesh
    ] of Object.entries(
      state.components.mesh ?? {}
    )) {
      for (const checker of registry) {
        checker.onMeshIteration && checker.onMeshIteration(
          state,
          entityId,
          mesh
        );
      }
    }
    for (const [
      entityId,
      material
    ] of Object.entries(
      state.components.material ?? {}
    )) {
      for (const checker of registry) {
        checker.onMaterialIteration && checker.onMaterialIteration(
          state,
          entityId,
          material
        );
      }
    }
    return state;
  }
);

// src/state/errors.ts
var DuplicateEntityError = class extends InvariantError {
  constructor(id) {
    super(
      `Entity Duplicated: ${id} is already added`
    );
    this.name = "DuplicateEntityError";
  }
};

// src/state/mutations.ts
function addEntity(state, id, name) {
  const hasAlready = state.entities[id];
  if (hasAlready) {
    throw new DuplicateEntityError(id);
  }
  const next = {
    ...state,
    entities: {
      ...state.entities,
      [id]: { name }
    }
  };
  assertInvariants("onupdate")(next);
  return next;
}
function removeEntity(state, id) {
  const hasEntityId = Boolean(
    state.entities[id]
  );
  if (!hasEntityId) return state;
  const {
    [id]: _omit,
    ...restEntities
  } = state.entities;
  const {
    [id]: _omitT,
    ...restTransforms
  } = state.components.transform;
  const next = {
    ...state,
    entities: restEntities,
    components: {
      ...state.components,
      transform: restTransforms
    }
  };
  assertInvariants("onupdate")(next);
  return next;
}

// src/state/selectors.ts
function diff(prev, next) {
  const all = /* @__PURE__ */ new Set();
  unionInto(all, diffEntities(prev, next));
  unionInto(all, diffTransform(prev, next));
  unionInto(all, diffMesh(prev, next));
  unionInto(all, diffMaterial(prev, next));
  return all;
}
function diffEntities(prev, next) {
  const out = /* @__PURE__ */ new Set();
  checkDiff(
    prev.entities,
    next.entities,
    (p, n, id) => p[id].name === n[id].name,
    out
  );
  return out;
}
function diffTransform(prev, next) {
  const out = /* @__PURE__ */ new Set();
  checkDiff(
    prev.components.transform,
    next.components.transform,
    (p, n, id) => transformEquals(p[id], n[id]),
    out
  );
  return out;
}
function diffMesh(prev, next) {
  const out = /* @__PURE__ */ new Set();
  checkDiff(
    prev.components.mesh ?? {},
    next.components.mesh ?? {},
    (p, n, id) => p[id] === n[id],
    out
  );
  return out;
}
function diffMaterial(prev, next) {
  const out = /* @__PURE__ */ new Set();
  checkDiff(
    prev.components.material ?? {},
    next.components.material ?? {},
    (p, n, id) => p[id] === n[id],
    out
  );
  return out;
}
function changedEntity(id, changes) {
  return changes.has(id);
}
function changedAny(ids, changes) {
  for (const id of ids)
    if (changes.has(id)) return true;
  return false;
}
function collectChanges(prev, next) {
  const entities = diffEntities(prev, next);
  const transform = diffTransform(prev, next);
  const mesh = diffMesh(prev, next);
  const material = diffMaterial(prev, next);
  const all = /* @__PURE__ */ new Set();
  unionInto(all, entities);
  unionInto(all, transform);
  unionInto(all, mesh);
  unionInto(all, material);
  return {
    all,
    entities,
    transform,
    mesh,
    material
  };
}
function checkDiff(prev, next, equalityChecker, changeMemo) {
  for (const entityId in prev) {
    if (!(entityId in next)) {
      changeMemo.add(entityId);
    } else if (!equalityChecker(prev, next, entityId)) {
      changeMemo.add(entityId);
    }
  }
  for (const entityId in next) {
    if (!(entityId in prev)) {
      changeMemo.add(entityId);
    }
  }
  return changeMemo;
}
function vec3Equals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function transformEquals(a, b) {
  return vec3Equals(a.position, b.position) && vec3Equals(a.rotation, b.rotation) && vec3Equals(a.scale, b.scale);
}
function unionInto(target, src) {
  for (const v of src) target.add(v);
}

// src/state/store.ts
var Store = class {
  currentState;
  updateListeners = /* @__PURE__ */ new Set();
  constructor(initialState) {
    this.currentState = initialState;
  }
  get state() {
    return this.currentState;
  }
  update(next) {
    if (this.currentState === next) return;
    const prev = this.currentState;
    this.currentState = next;
    const changes = collectChanges(prev, next);
    for (const listener of this.updateListeners) {
      listener({
        prev,
        next,
        changes
      });
    }
  }
  dispatch(command) {
    this.update(command.execute(this.state));
  }
  subscribe(listener) {
    this.updateListeners.add(listener);
    const unsubscribe = () => this.updateListeners.delete(listener);
    return unsubscribe;
  }
  destroy() {
    this.updateListeners.clear();
  }
};

// src/transform/index.ts
var DEFAULT_TRANSFORM = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1]
};
function setTransform(state, id, input) {
  if (!state.entities[id]) {
    throw new EntityNotFoundError(id);
  }
  const prevTransform = state.components.transform[id] ?? DEFAULT_TRANSFORM;
  const hasPartialInput = !("position" in input && "rotation" in input && "scale" in input);
  const nextTransform = hasPartialInput ? {
    position: input.position ?? prevTransform.position,
    rotation: input.rotation ?? prevTransform.rotation,
    scale: input.scale ?? prevTransform.scale
  } : input;
  const next = {
    ...state,
    components: {
      ...state.components,
      transform: {
        ...state.components.transform,
        [id]: nextTransform
      }
    }
  };
  assertInvariants("onupdate")(next);
  return next;
}

// src/command/utils/executor.ts
function applyCommand(state, command, options = {}) {
  const next = command.execute(state);
  return options.validate ?? true ? assertInvariants("onupdate")(next) : next;
}
function undoCommand(state, command, options = {}) {
  const next = command.undo(state);
  return options.validate ?? true ? assertInvariants("onupdate")(next) : next;
}

// src/command/commands/CompositeCommand.ts
var CompositeCommand = class {
  type = "composite";
  label;
  commands;
  constructor(commands) {
    this.label = "composite";
    this.commands = commands;
  }
  execute(state) {
    let next = state;
    for (const cmd of this.commands) {
      next = cmd.execute(next);
    }
    return next;
  }
  undo(state) {
    let next = state;
    for (let i = this.commands.length - 1; i >= 0; i--) {
      next = this.commands[i].undo(next);
    }
    return next;
  }
  isEmpty() {
    return this.commands.length === 0;
  }
};

// src/command/utils/group.ts
function group(commands) {
  return new CompositeCommand(commands);
}

// src/index.ts
var version = () => "core-0.0.0";

export { CURRENT_SCHEMA_VERSION, DEFAULT_TRANSFORM, Store, addEntity, applyCommand, assertInvariants, changedAny, changedEntity, collectChanges, createEmptyState, diff, diffEntities, diffMaterial, diffMesh, diffTransform, group, removeEntity, setTransform, undoCommand, version };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map