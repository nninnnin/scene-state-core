import {
  describe,
  expect,
  it,
} from "vitest";
import { HistoryManager } from "./HistoryManager";
import { takeSnapshot } from "../state/snapshot";
import {
  CURRENT_SCHEMA_VERSION,
  State,
} from "../state";

describe("HistoryManager jump + migrate", () => {
  it("오래된 스냅샷을 불러왔을 때에도 현재 버전으로 마이그레이션", () => {
    const old: State = {
      version: 0,
      entities: {},
      components: { transform: {} },
    };

    const historyManager =
      new HistoryManager(old);

    const snapshot = takeSnapshot(old);

    const restored =
      historyManager.jumpToSnapshot(
        snapshot,
        { history: "replace" },
      );

    expect(restored.version).toBe(
      CURRENT_SCHEMA_VERSION,
    );
  });
});
