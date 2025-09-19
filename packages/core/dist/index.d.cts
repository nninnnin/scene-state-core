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

declare function init(initial: State): void;
declare function getState(): State;

declare const version: () => string;

export { CURRENT_SCHEMA_VERSION, type Entity, type InvariantMode, type State, type Vec3, addEntity, assertInvariants, createEmptyState, getState, init, removeEntity, version };
