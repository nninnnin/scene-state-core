import z$1, { z } from 'zod';

declare const z_v3: z.ZodObject<{
    version: z.ZodLiteral<3>;
    entities: z.ZodRecord<z.ZodString, z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>>;
    components: z.ZodObject<{
        transform: z.ZodRecord<z.ZodString, z.ZodObject<{
            position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            rotation: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            scale: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        }, z.core.$strip>>;
        mesh: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        material: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;

type Vec3 = [
    number,
    number,
    number
];
interface Entity {
    name: string;
}
type State = z$1.infer<typeof z_v3>;
declare const CURRENT_SCHEMA_VERSION = 3;
declare function createEmptyState(): State;

type InvariantMode = "onupdate" | "onload";
declare const assertInvariants: (p1: InvariantMode) => (p2: {
    version: 3;
    entities: Record<string, {
        name: string;
    }>;
    components: {
        transform: Record<string, {
            position: [number, number, number];
            rotation: [number, number, number];
            scale: [number, number, number];
        }>;
        mesh?: Record<string, string> | undefined;
        material?: Record<string, string> | undefined;
    };
}) => {
    version: 3;
    entities: Record<string, {
        name: string;
    }>;
    components: {
        transform: Record<string, {
            position: [number, number, number];
            rotation: [number, number, number];
            scale: [number, number, number];
        }>;
        mesh?: Record<string, string> | undefined;
        material?: Record<string, string> | undefined;
    };
};

type EntityId = string;

declare function addEntity(state: State, id: EntityId, name: string): State;
declare function removeEntity(state: State, id: EntityId): State;

type ChangeSet = ReadonlySet<EntityId>;
declare function diff(prev: State, next: State): ChangeSet;
declare function diffEntities(prev: State, next: State): ReadonlySet<EntityId>;
declare function diffTransform(prev: State, next: State): ReadonlySet<EntityId>;
declare function diffMesh(prev: State, next: State): ReadonlySet<EntityId>;
declare function diffMaterial(prev: State, next: State): ReadonlySet<EntityId>;
declare function changedEntity(id: EntityId, changes: ReadonlySet<EntityId>): boolean;
declare function changedAny(ids: Iterable<EntityId>, changes: ReadonlySet<EntityId>): boolean;
declare function collectChanges(prev: State, next: State): {
    readonly all: Set<string>;
    readonly entities: ReadonlySet<string>;
    readonly transform: ReadonlySet<string>;
    readonly mesh: ReadonlySet<string>;
    readonly material: ReadonlySet<string>;
};

interface Command {
    readonly type: string;
    readonly description?: string;
    execute(state: State): State;
    undo(state: State): State;
}
interface Transform {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
}

declare class Store {
    private currentState;
    private updateListeners;
    constructor(initialState: State);
    get state(): {
        version: 3;
        entities: Record<string, {
            name: string;
        }>;
        components: {
            transform: Record<string, {
                position: [number, number, number];
                rotation: [number, number, number];
                scale: [number, number, number];
            }>;
            mesh?: Record<string, string> | undefined;
            material?: Record<string, string> | undefined;
        };
    };
    update(next: State): void;
    dispatch(command: Command): void;
    subscribe(listener: Listener): () => boolean;
    destroy(): void;
}
type Listener = (arg: {
    prev: State;
    next: State;
    changes: ReturnType<typeof collectChanges>;
}) => void;

declare const DEFAULT_TRANSFORM: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
};
declare function setTransform(state: State, id: EntityId, t: Transform): State;
declare function setTransform(state: State, id: EntityId, patch: Partial<Transform>): State;

declare const version: () => string;

export { CURRENT_SCHEMA_VERSION, type Command, DEFAULT_TRANSFORM, type Entity, type InvariantMode, type Listener, type State, Store, type Vec3, addEntity, assertInvariants, changedAny, changedEntity, collectChanges, createEmptyState, diff, diffEntities, diffMaterial, diffMesh, diffTransform, removeEntity, setTransform, version };
