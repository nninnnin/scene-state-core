import { z } from "zod";

import { VersionedInput } from "./state.types";
import {
  z_v0,
  z_v1,
  z_v2,
} from "./schema";

const preprocessor = (raw: any) => {
  if (
    typeof raw !== "object" ||
    raw === null
  ) {
    return raw;
  }

  const obj = raw as Record<
    string,
    any
  >;

  return {
    ...obj,
    version: obj.version ?? 0,
  };
};

const zAnyVersion = z.preprocess(
  preprocessor,
  z.discriminatedUnion("version", [
    z_v0.extend({
      version: z.literal(0),
    }), // `version` 필드가 옵셔널이면 공통된 필드가 존재하지 않으므로 discriminated union일 수 없다.
    z_v1,
    z_v2,
  ]),
);

export function parseVersioned(
  input: unknown,
): VersionedInput {
  const parsed =
    zAnyVersion.safeParse(input);

  // 버전이 0이었거나 비어있었지만 전처리기에서 0으로 초기화 된 경우
  if (
    parsed.success &&
    parsed.data.version === 0
  ) {
    // 최소한의 상태 모양과 기존의 데이터를 유지한 채로 반환
    return {
      version: 0,
      entities:
        parsed.data.entities ?? {},
      components: {
        transform:
          parsed.data.components
            ?.transform ?? {},
      },
    };
  } else if (parsed.error) {
    // null, 1, 'hello' 등 오브젝트 조차 아닌 값이었을 때
    return {
      version: 0,
      entities: {},
      components: { transform: {} },
    };
  }

  // 버전 0이 아닌 일반적인 상태 형상이었을 때
  return parsed.data as VersionedInput;
}
