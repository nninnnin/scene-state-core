'use strict';

var react = require('react');
var core = require('@ssc/core');
var jsxRuntime = require('react/jsx-runtime');

// src/components/SceneStateProvider.tsx
var StoreContext = react.createContext(null);
var SceneStateProvider = ({
  initialState,
  injectedStore,
  children
}) => {
  const storeRef = react.useRef(null);
  if (injectedStore) {
    storeRef.current = injectedStore;
  } else if (!storeRef.current) {
    storeRef.current = new core.Store(initialState);
  }
  return /* @__PURE__ */ jsxRuntime.jsx(StoreContext.Provider, { value: storeRef, children });
};
var useStore = () => {
  const storeRef = react.useContext(StoreContext);
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
  const [sceneState, setSceneState] = react.useState(() => {
    const state = store?.state;
    return selector ? selector(state) : state;
  });
  const prevRef = react.useRef(sceneState);
  react.useEffect(() => {
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

// src/index.ts
function useExample() {
  return "react-0.0.0";
}

exports.SceneStateProvider = SceneStateProvider;
exports.useExample = useExample;
exports.useSceneState = useSceneState;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map