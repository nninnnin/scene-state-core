import { useState } from "react";
import { getState, State } from "@ssc/core";

// overloads
export function useSceneState(): { sceneState: State };
export function useSceneState<T>(
  selector: () => T,
  equals?: (a: T, b: T) => boolean,
): { sceneState: State };

// implementation
export function useSceneState<T = State>(
  selector?: (state: State) => T,
  _equals?: (a: T, b: T) => boolean,
) {
  const [sceneState] = useState<T>(() => {
    const state = getState();
    return selector ? selector(state) : (state as T);
  });

  return { sceneState };
}
