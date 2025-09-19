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

// src/state/store.ts
var current;
function init(initial) {
  current = initial;
}
function getState() {
  return current;
}

// src/index.ts
var version = () => "core-0.0.0";

export { CURRENT_SCHEMA_VERSION, addEntity, assertInvariants, createEmptyState, getState, init, removeEntity, version };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map