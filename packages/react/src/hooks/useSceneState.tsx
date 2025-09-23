import { useEffect, useRef, useState } from "react";
import { Listener, State } from "@ssc/core";
import useStore from "./useStore";

type EqualsFn<T> = (a: T, b: T) => boolean;

const fallbackSelector = <T extends unknown>(
  state: State,
) => state as unknown as T;

const fallbackEqualityChecker = Object.is;

// overloads
export function useSceneState(): { sceneState: State };
export function useSceneState<T>(
  selector: (state: State) => T,
  equals?: EqualsFn<T>,
): { sceneState: T };

// implementation
export function useSceneState<ReturnType = State>(
  selector?: (state: State) => ReturnType,
  equals?: EqualsFn<ReturnType>,
) {
  // redefine optional funuctions
  const select =
    selector ?? fallbackSelector<ReturnType>;
  const isEqual = (equals ??
    fallbackEqualityChecker) as EqualsFn<ReturnType>;

  const { store } = useStore();

  // initialize scene state
  const [sceneState, setSceneState] =
    useState<ReturnType>(() => {
      const state = store?.state;

      return selector
        ? selector(state)
        : (state as ReturnType);
    });

  const prevRef = useRef<ReturnType>(sceneState);

  useEffect(() => {
    const listener: Listener = ({ next }) => {
      const selected = select(next);

      if (!isEqual(prevRef.current, selected)) {
        prevRef.current = selected;
        setSceneState(selected);
      }
    };

    const unsubscribe = store.subscribe(listener);

    return () => {
      unsubscribe();
    };
  }, [store, select, isEqual]);

  return { sceneState };
}
