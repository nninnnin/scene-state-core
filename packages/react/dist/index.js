import { createContext, useRef, useState, useEffect, useContext } from 'react';
import { Store, HistoryManager, group } from '@ssc/core';
import { jsx } from 'react/jsx-runtime';

// src/components/SceneStateProvider.tsx
var StoreContext = createContext(null);
var HistoryContext = createContext(null);
var SceneStateProvider = ({
  initialState,
  injectedStore,
  children
}) => {
  const storeRef = useRef(null);
  const historyRef = useRef(
    null
  );
  if (injectedStore) {
    storeRef.current = injectedStore;
  } else if (!storeRef.current) {
    storeRef.current = new Store(initialState);
  }
  if (!historyRef.current) {
    historyRef.current = new HistoryManager(
      storeRef.current
    );
  }
  return /* @__PURE__ */ jsx(StoreContext.Provider, { value: storeRef, children: /* @__PURE__ */ jsx(HistoryContext.Provider, { value: historyRef, children }) });
};
var useStore = () => {
  const storeRef = useContext(StoreContext);
  if (!storeRef?.current) {
    throw new Error(
      "SceneStateProvider is not mounted and no global store available. Wrap your app with <SceneStateProvider initialState={...}> or pass an injectedStore in tests."
    );
  }
  return {
    store: storeRef.current
  };
};
var useStore_default = useStore;

// src/hooks/useSceneState.tsx
var fallbackSelector = (state) => state;
var fallbackEqualityChecker = Object.is;
function useSceneState(selector, equals) {
  const select = selector ?? fallbackSelector;
  const isEqual = equals ?? fallbackEqualityChecker;
  const { store } = useStore_default();
  const [sceneState, setSceneState] = useState(() => {
    const state = store?.state;
    return selector ? selector(state) : state;
  });
  const prevRef = useRef(sceneState);
  useEffect(() => {
    const listener = ({ next }) => {
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
var useHistory = () => {
  const historyRef = useContext(HistoryContext);
  if (!historyRef?.current) {
    throw Error(
      "You should wrap the component with `SceneStateProvider` to use `useHistory`."
    );
  }
  return {
    historyManager: historyRef.current
  };
};

// src/hooks/useCommand.tsx
var useCommand = () => {
  const { historyManager } = useHistory();
  const dispatch = (command) => historyManager.execute(command);
  return {
    dispatch,
    group
  };
};

// src/index.ts
function useExample() {
  return "react-0.0.0";
}

export { SceneStateProvider, useCommand, useExample, useSceneState };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map