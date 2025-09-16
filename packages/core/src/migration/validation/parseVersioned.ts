import { VersionedInput } from "./state.types";
import {
  z_v0,
  z_v1,
  z_v2,
} from "./schema";

const zAnyVersion = z_v2
  .or(z_v1)
  .or(z_v0);

/** unknown → (버전별 느슨/엄격 스키마) → VersionedInput */
export function parseVersioned(
  input: unknown,
): VersionedInput {
  const parsed =
    zAnyVersion.safeParse(input);

  if (parsed.success)
    return parsed.data as VersionedInput;

  // version 없거나 알 수 없음 → v0 기본값
  const fallbackParsed =
    z_v0.safeParse(input);

  if (fallbackParsed.success) {
    return {
      version: 0,
      entities:
        fallbackParsed.data.entities ??
        {},
      components: {
        transform:
          fallbackParsed.data.components
            ?.transform ?? {},
      },
    };
  }

  const defaultEmptyState: VersionedInput =
    {
      version: 0,
      entities: {},
      components: { transform: {} },
    };

  return defaultEmptyState;
}
