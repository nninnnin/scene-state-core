import { z } from "zod";

const zNum = z.number();

export const zVec3Finite = z.tuple([
  zNum,
  zNum,
  zNum,
]);

// previous versions of state schema
export const z_v0 = z.looseObject({
  version: z.number().optional(),
  entities: z
    .record(z.string(), z.any())
    .optional(),
  componets: z
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
            position: z
              .any()
              .optional(),
            rotation: z
              .any()
              .optional(),
            scale: z.any().optional(),
          }),
        )
        .default({}),
    })
    .default({ transform: {} }),
});

// current schema
export const z_v2 = z.object({
  version: z.literal(2),
  entities: z.record(
    z.string(),
    z.object({
      name: z.string().min(1),
    }),
  ),
  components: z.record(
    z.string(),
    z.object({
      position: z.number(),
      rotation: z.number(),
      scale: z.number(),
    }),
  ),
});
