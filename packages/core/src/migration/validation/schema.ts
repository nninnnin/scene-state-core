import { z } from "zod";

const zNum = z.number();

export const zVec3Finite = z.tuple([zNum, zNum, zNum]);

// previous versions of state schema
export const z_v0 = z.looseObject({
  version: z.number().optional(),
  entities: z.record(z.string(), z.any()).optional(),
  components: z
    .object({
      transform: z
        .record(z.string(), z.any())
        .optional(),
    })
    .partial()
    .optional(),
});

export const z_v1 = z.looseObject({
  version: z.literal(1),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1),
    }),
  ),
  components: z
    .object({
      transform: z
        .record(
          z.string(),
          z.object({
            position: z.any().optional(),
            rotation: z.any().optional(),
            scale: z.any().optional(),
          }),
        )
        .default({}),
    })
    .default({ transform: {} }),
});

export const z_v2 = z.object({
  version: z.literal(2),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1),
    }),
  ),
  components: z.object({
    transform: z.record(
      z.string(),
      z.object({
        position: zVec3Finite,
        rotation: zVec3Finite,
        scale: zVec3Finite,
      }),
    ),
  }),
});

export const z_v3 = z.object({
  version: z.literal(3),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1),
    }),
  ),
  components: z.object({
    transform: z.record(
      z.string(),
      z.object({
        position: zVec3Finite,
        rotation: zVec3Finite,
        scale: zVec3Finite,
      }),
    ),
    mesh: z.record(z.string(), z.string()).optional(),
    material: z
      .record(z.string(), z.string())
      .optional(),
  }),
});

// current schema
export const z_v4 = z.object({
  version: z.literal(4),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1),
    }),
  ),
  components: z.object({
    transform: z.record(
      z.string(),
      z
        .object({
          position: zVec3Finite,
          rotation: zVec3Finite,
          scale: zVec3Finite,
        })
        .optional(),
    ),
    mesh: z.record(z.string(), z.string()).optional(),
    material: z
      .record(z.string(), z.string())
      .optional(),
  }),
});
