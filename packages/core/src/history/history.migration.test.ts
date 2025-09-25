import { describe, expect, it } from "vitest";

import { HistoryManager } from "./HistoryManager";
import { takeSnapshot } from "../state/snapshot";
import {
  CURRENT_SCHEMA_VERSION,
  Store,
} from "../state";
import {
  LatestSchema,
  StateV0,
} from "../migration/validation/state.types";

describe("HistoryManager jump + migrate", () => {
  it("오래된 스냅샷을 불러왔을 때에도 현재 버전으로 마이그레이션", () => {
    const old: StateV0 = {
      version: 0,
      entities: {},
      components: { transform: {} },
    };

    const store = new Store(old as LatestSchema);

    const historyManager = new HistoryManager(
      store, // allow for test using snapshot
    );

    const snapshot = takeSnapshot(
      old as LatestSchema, // allow for test using snapshot
    );

    const restored = historyManager.jumpToSnapshot(
      snapshot,
      { history: "replace" },
    );

    expect(restored.version).toBe(
      CURRENT_SCHEMA_VERSION,
    );
  });
});
