import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
} from "vitest";
import {
  act,
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import {
  createEmptyState,
  addEntity,
  removeEntity,
  State,
  Store,
  setTransform,
} from "@ssc/core";
import { useSceneState } from "./useSceneState";
import { SceneStateProvider } from "../components/SceneStateProvider";

function Probe<T>({
  selector,
  onRender,
}: {
  selector: (s: State) => T;
  onRender: (v: T) => void;
}) {
  const { sceneState } = useSceneState<T>(selector);

  onRender(sceneState);

  return (
    <div data-testid="val">{String(sceneState)}</div>
  );
}

describe("useSceneState basic reactivity (no equals)", () => {
  let testStore: Store;

  beforeEach(() => {
    // 매번 초기화 되는 스토어
    testStore = new Store(createEmptyState());

    const updatedState = addEntity(
      testStore.state,
      "a",
      "A",
    );

    testStore.update(updatedState);
  });

  afterEach(() => {
    cleanup(); // Unmount Provider
  });

  it("관심 없는 변경은 리렌더 안 하고, 관심 대상 변경만 리렌더한다", () => {
    const onRender = (v: string) => {};

    const onRenderSpy = vi.fn(onRender);

    render(
      <SceneStateProvider
        initialState={createEmptyState()}
        injectedStore={testStore}
      >
        <Probe
          selector={(s) =>
            String(
              s.entities["a"]
                ? s.entities["a"].name
                : "사라졌다",
            )
          }
          onRender={onRenderSpy}
        />
      </SceneStateProvider>,
    );

    // initial render: entity "a" exists
    expect(screen.getByTestId("val").textContent).toBe(
      "A",
    ); // Probe 컴포넌트 렌더링 확인
    expect(onRenderSpy).toHaveBeenCalledTimes(1);

    // mutate store directly in test and notify subscribers
    act(() =>
      testStore.update(
        removeEntity(testStore.state, "a"),
      ),
    );

    // after change, Probe should reflect update
    expect(screen.getByTestId("val").textContent).toBe(
      "사라졌다",
    );

    expect(onRenderSpy).toHaveBeenCalledTimes(2);
  });
});

describe("Interested vs Uninterested", () => {
  const testStore: Store = new Store(
    addEntity(
      createEmptyState(),
      "thisismyid",
      "Justin",
    ),
  );

  const Probe = ({
    onRender,
  }: {
    onRender: () => void;
  }) => {
    const selector = (state: State) =>
      state.entities["thisismyid"];

    const { sceneState } = useSceneState(selector);

    onRender();

    return (
      <div data-testid="my-name">
        {sceneState?.name}
      </div>
    );
  };

  const onRender = vi.fn();

  it("selector로 선택된 요소에 의해서만 렌더링이 일어난다", () => {
    render(
      <SceneStateProvider
        initialState={createEmptyState()}
        injectedStore={testStore}
      >
        <Probe onRender={onRender} />
      </SceneStateProvider>,
    );

    expect(
      screen.getByTestId("my-name"),
    ).toBeDefined(); // 존재 확인

    expect(onRender).toHaveBeenCalledTimes(1);

    act(() =>
      testStore.update(
        setTransform(testStore.state, "thisismyid", {
          position: [0, 0, 0],
        }),
      ),
    );

    // 셀렉터의 관심사 밖이므로 렌더링이 일어나지 않는다
    expect(onRender).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Justin")).toBeDefined();

    act(() =>
      testStore.update(
        removeEntity(testStore.state, "thisismyid"),
      ),
    );

    // 관심사인 entity가 제거되었으므로 리렌더링 된다
    expect(onRender).toHaveBeenCalledTimes(2);
    expect(() => screen.getByText("Justin")).toThrow();
  });
});
