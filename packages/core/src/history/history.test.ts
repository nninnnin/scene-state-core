import {
  describe,
  expect,
  it,
} from "vitest";
import { HistoryManager } from "./HistoryManager";
import { SetTransformCommand } from "../command/commands/SetTransformCommand";

import { EntityNotFoundError } from "../common/errors";
import { Transform } from "../command/types";
import {
  CURRENT_SCHEMA_VERSION,
  State,
} from "../state";

function t(
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  return [x, y, z];
}
function transform(
  p: [number, number, number],
  r: [number, number, number],
  s: [number, number, number],
): Transform {
  return {
    position: p,
    rotation: r,
    scale: s,
  };
}

function makeInitialState(): State {
  return {
    version: CURRENT_SCHEMA_VERSION,
    entities: {
      a: { name: "A" },
      b: { name: "B" },
    },
    components: {
      transform: {
        a: transform(
          t(0, 0, 0),
          t(0, 0, 0),
          t(1, 1, 1),
        ),
        b: transform(
          t(5, 0, 0),
          t(0, 0, 0),
          t(1, 1, 1),
        ),
      },
    },
  };
}

describe("HistoryManager", () => {
  it("그룹 이동이 한 엔트리로 쌓이고 undo/redo가 왕복된다.", () => {
    const history = new HistoryManager(
      makeInitialState(),
    );

    history.group(
      "그룹 이동",
      (collectCommand) => {
        const a =
          history.state.components
            .transform["a"].position;
        const b =
          history.state.components
            .transform["b"].position;

        collectCommand(
          new SetTransformCommand("a", {
            position: [
              a[0] + 10,
              a[1],
              a[2],
            ],
          }),
        );

        collectCommand(
          new SetTransformCommand("b", {
            position: [
              b[0] + 10,
              b[1],
              b[2],
            ],
          }),
        );
      },
    );

    // 각각 position x를 10씩 이동(=그룹이동)한 후의 결과
    expect(history.stacks.undo).toEqual(
      ["그룹 이동"],
    );
    const after = history.state;
    expect(
      after.components.transform["a"]
        .position,
    ).toEqual([10, 0, 0]);
    expect(
      after.components.transform["b"]
        .position,
    ).toEqual([15, 0, 0]);

    // 10씩 이동한 것 철회
    history.undo();
    expect(history.stacks.redo).toEqual(
      ["그룹 이동"],
    );
    expect(history.stacks.redo).toEqual(
      ["그룹 이동"],
    );
    expect(
      history.state.components
        .transform["a"].position,
    ).toEqual([0, 0, 0]);
    expect(
      history.state.components
        .transform["b"].position,
    ).toEqual([5, 0, 0]);

    // 다시 적용
    history.redo();
    expect(
      history.state.components
        .transform["a"].position,
    ).toEqual([10, 0, 0]);
    expect(
      history.state.components
        .transform["b"].position,
    ).toEqual([15, 0, 0]);
  });

  it("그룹 내 커맨드 실패(EntityNotFoundError) 시 전체 롤백되고 기록되지 않는다", () => {
    const history = new HistoryManager(
      makeInitialState(),
    );
    const before = history.state;

    expect(() => {
      history.group(
        "실패 그룹",
        (collect) => {
          // 존재하는 a는 성공 커맨드
          const a =
            history.state.components
              .transform["a"].position;
          collect(
            new SetTransformCommand(
              "a",
              {
                position: [
                  a[0] + 1,
                  a[1],
                  a[2],
                ],
              },
            ),
          );
          // 존재하지 않는 id → setTransform 내부에서 EntityNotFoundError
          collect(
            new SetTransformCommand(
              "ghost",
              { position: [0, 0, 0] },
            ),
          );
        },
      );
    }).toThrow(EntityNotFoundError);

    // 롤백 확인: 상태 불변, 히스토리 미기록
    expect(history.state).toEqual(
      before,
    );
    expect(history.stacks.undo).toEqual(
      [],
    );
    expect(history.stacks.redo).toEqual(
      [],
    );
  });

  it("단일 실행에서 위치와 스케일을 동시에 패치하고 undo로 복구된다", () => {
    const history = new HistoryManager(
      makeInitialState(),
    );

    history.execute(
      "프리셋",
      new SetTransformCommand("a", {
        position: [1, 2, 3],
        scale: [2, 2, 2],
      }),
    );

    expect(history.stacks.undo).toEqual(
      ["프리셋"],
    );
    expect(
      history.state.components
        .transform["a"].position,
    ).toEqual([1, 2, 3]);
    expect(
      history.state.components
        .transform["a"].scale,
    ).toEqual([2, 2, 2]);

    history.undo();
    expect(
      history.state.components
        .transform["a"].position,
    ).toEqual([0, 0, 0]);
    expect(
      history.state.components
        .transform["a"].scale,
    ).toEqual([1, 1, 1]);
  });

  it("undo 이후 새 execute가 발생하면 redo 스택이 초기화된다", () => {
    const history = new HistoryManager(
      makeInitialState(),
    );

    // 첫 변경
    history.execute(
      "이동1",
      new SetTransformCommand("a", {
        position: [10, 0, 0],
      }),
    );
    // 두 번째 변경
    history.execute(
      "이동2",
      new SetTransformCommand("a", {
        position: [20, 0, 0],
      }),
    );

    expect(history.stacks.undo).toEqual(
      ["이동1", "이동2"],
    );
    history.undo(); // 이동2 취소
    expect(history.stacks.redo).toEqual(
      ["이동2"],
    );

    // 새 실행 → redo 비워야 함
    history.execute(
      "이동3",
      new SetTransformCommand("a", {
        position: [30, 0, 0],
      }),
    );
    expect(history.stacks.undo).toEqual(
      ["이동1", "이동3"],
    );
    expect(history.stacks.redo).toEqual(
      [],
    );
    expect(
      history.state.components
        .transform["a"].position,
    ).toEqual([30, 0, 0]);
  });

  it("빈 그룹(group 내 collect 미호출)은 기록되지 않는다", () => {
    const history = new HistoryManager(
      makeInitialState(),
    );
    history.group("빈 그룹", () => {
      // collect 호출 없음
    });
    expect(history.stacks.undo).toEqual(
      [],
    );
    expect(history.stacks.redo).toEqual(
      [],
    );
  });
});
