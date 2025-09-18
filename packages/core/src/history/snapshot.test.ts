import {
  describe,
  expect,
  it,
} from "vitest";
import { State } from "../state";
import { HistoryManager } from "./HistoryManager";
import { AddEntityCommand } from "../command/commands/entity/AddEntityCommand";
import { SetTransformCommand } from "../command/commands/transform/SetTransformCommand";

function baseState(): State {
  return {
    entities: {
      a: { name: "A" },
    },
    components: {
      transform: {
        a: {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      },
    },
  };
}

describe("HistoryManager snapshot jump", () => {
  it("체크포인트를 생성하고 롤백하여 상태 복원 확인", () => {
    const historyManager =
      new HistoryManager(baseState());

    const CHECKPOINT_KEY_INIT = "init";

    historyManager.createCheckpoint(
      CHECKPOINT_KEY_INIT,
    );

    historyManager.execute(
      "add entity B",
      new AddEntityCommand("b", "B"),
    );

    historyManager.execute(
      "set transform of entity A",
      new SetTransformCommand("a", {
        position: [9, 9, 9],
      }),
    );

    const entityIds = Object.keys(
      historyManager.state.entities,
    );

    // is entities added
    expect(entityIds).toEqual([
      "a",
      "b",
    ]);

    const entityA_transform =
      historyManager.state.components
        .transform["a"];

    // is entity A position changed
    expect(
      entityA_transform.position,
    ).toEqual([9, 9, 9]);

    // rollback to snapshot
    historyManager.jumpToCheckpoint(
      CHECKPOINT_KEY_INIT,
    );

    const rollbackState =
      historyManager.state;

    expect(
      Object.keys(
        rollbackState.entities,
      ),
    ).toEqual(["a"]);

    expect(
      rollbackState.components
        .transform["a"].position,
    ).toEqual([0, 0, 0]);
  });

  it("존재하지 않는 체크포인트로 롤백 시도 시 no operation 및 상태 참조 유지", () => {
    const historyManager =
      new HistoryManager(baseState());

    const before = historyManager.state;

    historyManager.jumpToCheckpoint(
      "ghost",
    );

    expect(historyManager.state).toBe(
      before,
    );
  });

  it("체크포인트로 롤백 시 히스토리 초기화", () => {
    const historyManager =
      new HistoryManager(baseState());

    historyManager.execute(
      "add entity X",
      new AddEntityCommand("x", "X"),
    );

    const CHECKPOINT_KEY_WITH_X =
      "withX";

    historyManager.createCheckpoint(
      CHECKPOINT_KEY_WITH_X,
    );

    historyManager.execute(
      "add entity Y",
      new AddEntityCommand("y", "Y"),
    );

    const CHECKPOINT_KEY_WITH_XY =
      "withXY";

    historyManager.createCheckpoint(
      CHECKPOINT_KEY_WITH_XY,
    );

    historyManager.undo();

    expect(
      Object.keys(
        historyManager.state.entities,
      ),
    ).toEqual(["a", "x"]);

    historyManager.jumpToCheckpoint(
      CHECKPOINT_KEY_WITH_XY,
    );

    expect(
      Object.keys(
        historyManager.state.entities,
      ),
    ).toEqual(["a", "x", "y"]);

    // stacks are reset after jump
    expect(
      historyManager.stacks,
    ).toEqual({
      undo: [],
      redo: [],
    });
  });

  it("스냅샷 점프 시 preserve option을 이용하면 history 보존 가능", () => {
    const historyManager =
      new HistoryManager(baseState());

    historyManager.execute(
      "add entity P",
      new AddEntityCommand("p", "P"),
    );

    const CHECKPOINT_KEY_WITH_P =
      "with P";

    historyManager.createCheckpoint(
      CHECKPOINT_KEY_WITH_P,
    );

    historyManager.execute(
      "add entity K",
      new AddEntityCommand("k", "K"),
    );

    expect(
      Object.keys(
        historyManager.state.entities,
      ),
    ).toEqual(["a", "p", "k"]);

    historyManager.jumpToCheckpoint(
      CHECKPOINT_KEY_WITH_P,
      { history: "preserve" },
    );

    historyManager.undo();

    historyManager.undo();
  });
});
