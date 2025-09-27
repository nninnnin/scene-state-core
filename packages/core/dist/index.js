import { curry, isEqual } from 'es-toolkit';
import { z } from 'zod';

// src/state/types.ts
var CURRENT_SCHEMA_VERSION = 4;
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
var assertInvariants = curry(function(mode, state) {
  const registry = registries[mode];
  for (const [entityId, entity] of Object.entries(
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
  for (const [entityId, transform] of Object.entries(
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
  for (const [entityId, mesh] of Object.entries(
    state.components.mesh ?? {}
  )) {
    for (const checker of registry) {
      checker.onMeshIteration && checker.onMeshIteration(state, entityId, mesh);
    }
  }
  for (const [entityId, material] of Object.entries(
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
});

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
    prev.components.transform ?? {},
    next.components.transform ?? {},
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

// src/command/commands/entity/AddEntityCommand.ts
var AddEntityCommand = class {
  constructor(entityId, name) {
    this.entityId = entityId;
    this.name = name;
    this.description = `Add entity(${entityId})`;
  }
  type = "AddEntity";
  description;
  execute(state) {
    return addEntity(
      state,
      this.entityId,
      this.name
    );
  }
  undo(state) {
    return removeEntity(
      state,
      this.entityId
    );
  }
};

// src/command/commands/entity/RemoveEntityCommand.ts
var RemoveEntityCommand = class {
  constructor(entityId) {
    this.entityId = entityId;
  }
  type = "RemoveEntity";
  prevName;
  prevTransform;
  execute(state) {
    const entity = state.entities[this.entityId];
    this.prevName = entity?.name;
    this.prevTransform = state.components.transform[this.entityId];
    return removeEntity(
      state,
      this.entityId
    );
  }
  undo(state) {
    if (this.prevName == null)
      return state;
    let next = addEntity(
      state,
      this.entityId,
      this.prevName
    );
    if (this.prevTransform) {
      next = setTransform(
        next,
        this.entityId,
        this.prevTransform
      );
    }
    return next;
  }
};

// src/command/commands/material/SetMaterialCommand.ts
var SetMaterialCommand = class {
  constructor(id, materialRef, prevMaterial) {
    this.id = id;
    this.materialRef = materialRef;
    this.prevMaterial = prevMaterial;
  }
  type = "Setmaterial";
  execute(state) {
    if (!state.entities[this.id]) {
      throw new EntityNotFoundError(
        this.id
      );
    }
    const prevMaterial = state.components.material?.[this.id];
    const nextState = {
      ...state,
      components: {
        ...state.components,
        material: {
          ...state.components.material ?? {},
          [this.id]: this.materialRef
        }
      }
    };
    this.prevMaterial = prevMaterial;
    return nextState;
  }
  undo(state) {
    const material = {
      ...state.components.material ?? {}
    };
    if (this.prevMaterial) {
      material[this.id] = this.prevMaterial;
    } else {
      delete material[this.id];
    }
    return {
      ...state,
      components: {
        ...state.components,
        material
      }
    };
  }
};

// src/command/commands/material/ClearMaterialCommand.ts
var ClearMaterialCommand = class {
  constructor(id) {
    this.id = id;
  }
  type = "ClearMaterial";
  prevMaterial;
  execute(state) {
    if (!state.entities[this.id])
      throw new EntityNotFoundError(
        this.id
      );
    const material = {
      ...state.components.material ?? {}
    };
    this.prevMaterial = material[this.id];
    if (material[this.id] !== void 0) {
      delete material[this.id];
    }
    return {
      ...state,
      components: {
        ...state.components,
        material
      }
    };
  }
  undo(state) {
    const material = {
      ...state.components.material ?? {}
    };
    if (this.prevMaterial) {
      material[this.id] = this.prevMaterial;
    }
    return {
      ...state,
      components: {
        ...state.components,
        material
      }
    };
  }
};

// src/command/commands/mesh/SetMeshCommand.ts
var SetMeshCommand = class {
  constructor(id, meshRef, prevMesh) {
    this.id = id;
    this.meshRef = meshRef;
    this.prevMesh = prevMesh;
  }
  type = "SetMesh";
  execute(state) {
    if (!state.entities[this.id]) {
      throw new EntityNotFoundError(
        this.id
      );
    }
    const prevMesh = state.components.mesh?.[this.id];
    const nextState = {
      ...state,
      components: {
        ...state.components,
        mesh: {
          ...state.components.mesh ?? {},
          [this.id]: this.meshRef
        }
      }
    };
    this.prevMesh = prevMesh;
    return nextState;
  }
  undo(state) {
    const mesh = {
      ...state.components.mesh ?? {}
    };
    if (this.prevMesh) {
      mesh[this.id] = this.prevMesh;
    } else {
      delete mesh[this.id];
    }
    return {
      ...state,
      components: {
        ...state.components,
        mesh
      }
    };
  }
};

// src/command/commands/mesh/ClearMeshCommand.ts
var ClearMeshCommand = class {
  constructor(id) {
    this.id = id;
  }
  type = "ClearMesh";
  prevMesh;
  execute(state) {
    if (!state.entities[this.id])
      throw new EntityNotFoundError(
        this.id
      );
    const mesh = {
      ...state.components.mesh ?? {}
    };
    this.prevMesh = mesh[this.id];
    if (mesh[this.id] !== void 0) {
      delete mesh[this.id];
    }
    return {
      ...state,
      components: {
        ...state.components,
        mesh
      }
    };
  }
  undo(state) {
    const mesh = {
      ...state.components.mesh ?? {}
    };
    if (this.prevMesh) {
      mesh[this.id] = this.prevMesh;
    }
    return {
      ...state,
      components: {
        ...state.components,
        mesh
      }
    };
  }
};

// src/command/commands/transform/SetTransformCommand.ts
var SetTransformCommand = class {
  constructor(entityId, patch) {
    this.entityId = entityId;
    this.patch = patch;
  }
  type = "SetTransform";
  prev;
  execute(state) {
    this.prev = state.components.transform[this.entityId];
    return setTransform(
      state,
      this.entityId,
      this.patch
    );
  }
  undo(state) {
    if (this.prev) {
      return setTransform(
        state,
        this.entityId,
        this.prev
      );
    }
    return state;
  }
};

// src/migration/errors.ts
var MigrationError = class extends Error {
  name = "MigrationError";
};
var NoMigrationPathError = class extends MigrationError {
  from;
  to;
  constructor(from, to) {
    super(
      `No migration path: ${from} -> ${to}`
    );
    this.name = "NoMigrationPathError";
    this.from = from;
    this.to = to;
  }
};

// src/migration/migrations/0_to_1.ts
var m0_to_1 = {
  from: 0,
  to: 1,
  apply(state) {
    return {
      ...state,
      entities: state.entities ?? {},
      components: {
        ...state.components,
        transform: state.components?.transform ?? {}
      },
      version: 1
    };
  }
};

// src/migration/migrations/1_to_2.ts
var m1_to_2 = {
  from: 1,
  to: 2,
  apply(state) {
    const newState = { ...state };
    const entities = newState.entities ?? {};
    const transform = newState.components?.transform ?? {};
    const newTransform = Object.keys(transform).reduce(
      (newTransform2, entityId) => {
        const hasEntity = entities[entityId];
        if (hasEntity) {
          const entityTransform = transform[entityId] ?? DEFAULT_TRANSFORM;
          newTransform2[entityId] = {
            position: sanitizeVector3(
              entityTransform.position,
              DEFAULT_TRANSFORM.position
            ),
            rotation: sanitizeVector3(
              entityTransform.rotation,
              DEFAULT_TRANSFORM.rotation
            ),
            scale: sanitizeVector3(
              entityTransform.scale,
              DEFAULT_TRANSFORM.scale,
              1
              // zero replacement
            )
          };
        }
        return newTransform2;
      },
      {}
    );
    return {
      ...newState,
      components: {
        ...newState.components ?? {},
        transform: newTransform
      },
      version: 2
    };
  }
};
function isFiniteNum(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function sanitizeVector3(input, defaultVector, zeroReplacement) {
  const vector = Array.isArray(input) ? input : defaultVector;
  const [inputX, inputY, inputZ] = vector;
  const [defaultX, defaultY, defaultZ] = defaultVector;
  const x = isFiniteNum(inputX) ? inputX : defaultX;
  const y = isFiniteNum(inputY) ? inputY : defaultY;
  const z3 = isFiniteNum(inputZ) ? inputZ : defaultZ;
  const sanitized = [x, y, z3];
  return zeroReplacement ? sanitized.map(
    (el) => el === 0 ? zeroReplacement : el
  ) : sanitized;
}

// src/migration/migrations/2_to_3.ts
var m2_to_3 = {
  from: 2,
  to: 3,
  apply(prev) {
    const filterEntityOriented = (map) => {
      return Object.fromEntries(
        Object.entries(map).filter(
          ([entityId, value]) => {
            const hasEntityOriented = prev.entities[entityId] !== void 0;
            const hasValidValue = typeof value === "string";
            return hasEntityOriented && hasValidValue;
          }
        )
      );
    };
    const newState = {
      version: 3,
      entities: prev.entities,
      components: {
        transform: prev.components.transform,
        mesh: filterEntityOriented(
          prev.components?.mesh ?? {}
        ),
        material: filterEntityOriented(
          prev.components?.material ?? {}
        )
      }
    };
    return newState;
  }
};

// src/migration/registry.ts
var MIGRATIONS = [
  m0_to_1,
  m1_to_2,
  m2_to_3
];
var zNum = z.number();
var zVec3Finite = z.tuple([zNum, zNum, zNum]);
var z_v0 = z.looseObject({
  version: z.number().optional(),
  entities: z.record(z.string(), z.any()).optional(),
  components: z.object({
    transform: z.record(z.string(), z.any()).optional()
  }).partial().optional()
});
var z_v1 = z.looseObject({
  version: z.literal(1),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1)
    })
  ),
  components: z.object({
    transform: z.record(
      z.string(),
      z.object({
        position: z.any().optional(),
        rotation: z.any().optional(),
        scale: z.any().optional()
      })
    ).default({})
  }).default({ transform: {} })
});
var z_v2 = z.object({
  version: z.literal(2),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1)
    })
  ),
  components: z.object({
    transform: z.record(
      z.string(),
      z.object({
        position: zVec3Finite,
        rotation: zVec3Finite,
        scale: zVec3Finite
      })
    )
  })
});
z.object({
  version: z.literal(3),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1)
    })
  ),
  components: z.object({
    transform: z.record(
      z.string(),
      z.object({
        position: zVec3Finite,
        rotation: zVec3Finite,
        scale: zVec3Finite
      })
    ),
    mesh: z.record(z.string(), z.string()).optional(),
    material: z.record(z.string(), z.string()).optional()
  })
});
z.object({
  version: z.literal(CURRENT_SCHEMA_VERSION),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1)
    })
  ),
  components: z.object({
    transform: z.record(
      z.string(),
      z.object({
        position: zVec3Finite,
        rotation: zVec3Finite,
        scale: zVec3Finite
      }).optional()
    ),
    mesh: z.record(z.string(), z.string()).optional(),
    material: z.record(z.string(), z.string()).optional()
  })
});

// src/migration/validation/parseVersioned.ts
var preprocessor = (raw) => {
  if (typeof raw !== "object" || raw === null) {
    return raw;
  }
  const obj = raw;
  return {
    ...obj,
    version: obj.version ?? 0
  };
};
var zAnyVersion = z.preprocess(
  preprocessor,
  z.discriminatedUnion("version", [
    z_v0.extend({
      version: z.literal(0)
    }),
    // `version` 필드가 옵셔널이면 공통된 필드가 존재하지 않으므로 discriminated union일 수 없다.
    z_v1,
    z_v2
  ])
);
function parseVersioned(input) {
  const parsed = zAnyVersion.safeParse(input);
  if (parsed.success && parsed.data.version === 0) {
    return {
      version: 0,
      entities: parsed.data.entities ?? {},
      components: {
        transform: parsed.data.components?.transform ?? {}
      }
    };
  } else if (parsed.error) {
    return {
      version: 0,
      entities: {},
      components: { transform: {} }
    };
  }
  return parsed.data;
}

// src/migration/apply.ts
var migrationMap = new Map(
  MIGRATIONS.map((m) => [m.from, m])
);
function checkOutVersioned(input) {
  const isObject = typeof input === "object" && input !== null;
  const rawVersion = isObject ? input.version : void 0;
  if (typeof rawVersion === "number" && rawVersion > CURRENT_SCHEMA_VERSION) {
    throw new NoMigrationPathError(
      rawVersion,
      CURRENT_SCHEMA_VERSION
    );
  }
}
function migrateState(input, options) {
  const migrateTo = CURRENT_SCHEMA_VERSION;
  const parsedState = parseVersioned(input);
  checkOutVersioned(input);
  let migratedState = parsedState;
  while (migratedState.version !== migrateTo) {
    const currentMigration = migrationMap.get(
      migratedState.version
    );
    if (!currentMigration) {
      throw new NoMigrationPathError(
        migratedState.version,
        migrateTo
      );
    }
    migratedState = currentMigration.apply(
      migratedState
    );
  }
  const invariantCheckedState = assertInvariants("onload")(
    migratedState
  );
  return invariantCheckedState;
}

// src/state/snapshot.ts
function takeSnapshot(state) {
  return state;
}
function rollbackTo(snapshot) {
  return snapshot;
}

// src/history/HistoryManager.ts
var HistoryManager = class {
  undoStack = [];
  redoStack = [];
  store;
  checkpoints = /* @__PURE__ */ new Map();
  constructor(store) {
    this.store = store;
  }
  get state() {
    return this.store.state;
  }
  get stacks() {
    const mapEntryLabel = (entries) => entries.map((entry) => entry.label);
    return {
      undoStack: mapEntryLabel(this.undoStack),
      redoStack: mapEntryLabel(this.redoStack)
    };
  }
  group(label, collector) {
    const bucket = [];
    const snapshot = this.store.state;
    let result;
    try {
      result = collector(
        (c) => bucket.push(c)
      );
      if (bucket.length === 0) return result;
      const composite = new CompositeCommand(bucket);
      const executed = composite.execute(snapshot);
      if (executed === snapshot) return result;
      this.undoStack.push({
        label,
        command: composite
      });
      this.redoStack = [];
      this.store.update(executed);
      return result;
    } catch (error) {
      this.store.update(snapshot);
      throw error;
    }
  }
  execute(command) {
    const prev = this.store.state;
    const next = command.execute(prev);
    if (isEqual(prev, next)) {
      return;
    }
    this.undoStack.push({
      label: command.type,
      command
    });
    this.redoStack = [];
    this.store.update(next);
  }
  undo() {
    const entry = this.undoStack.pop();
    if (!entry) {
      console.log("Has no undo stack");
      return;
    }
    const prev = this.store.state;
    const next = entry.command.undo(prev);
    this.redoStack.push(entry);
    this.store.update(next);
  }
  redo() {
    const entry = this.redoStack.pop();
    if (!entry) {
      console.log("Has no redo stack");
      return;
    }
    const prev = this.store.state;
    const next = entry.command.execute(prev);
    this.undoStack.push(entry);
    this.store.update(next);
  }
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
  createCheckpoint(id) {
    const snapshot = takeSnapshot(this.store.state);
    this.checkpoints.set(id, snapshot);
    return snapshot;
  }
  jumpToSnapshot(snapshot, opts = {
    history: "replace"
  }) {
    const restored = rollbackTo(snapshot);
    const migrated = migrateState(restored);
    const validated = assertInvariants("onload")(migrated);
    this.store.update(validated);
    if (opts.history === "replace") {
      this.undoStack = [];
      this.redoStack = [];
    }
    return this.store.state;
  }
  jumpToCheckpoint(id, opts) {
    const snap = this.checkpoints.get(id);
    if (!snap) return this.store.state;
    return this.jumpToSnapshot(snap, opts);
  }
  listCheckpoints() {
    return Array.from(this.checkpoints.keys());
  }
  removeCheckpoint(id) {
    return this.checkpoints.delete(id);
  }
  clearCheckpoints() {
    this.checkpoints.clear();
  }
};

// src/index.ts
var version = () => "core-0.0.0";

export { AddEntityCommand, CURRENT_SCHEMA_VERSION, ClearMaterialCommand, ClearMeshCommand, CompositeCommand, DEFAULT_TRANSFORM, HistoryManager, RemoveEntityCommand, SetMaterialCommand, SetMeshCommand, SetTransformCommand, Store, addEntity, applyCommand, assertInvariants, changedAny, changedEntity, collectChanges, createEmptyState, diff, diffEntities, diffMaterial, diffMesh, diffTransform, group, removeEntity, setTransform, undoCommand, version };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map