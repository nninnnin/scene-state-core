import { useRef, useEffect, useState } from 'react';
import { init, getState } from '@ssc/core';
import { jsx, Fragment } from 'react/jsx-runtime';

// src/SceneStateProvider.tsx
var SceneStateProvider = ({
  initialState,
  children
}) => {
  const inited = useRef(false);
  useEffect(() => {
    if (!inited.current) {
      init(initialState);
      inited.current = true;
    }
  }, [initialState]);
  return /* @__PURE__ */ jsx(Fragment, { children });
};
var useSceneState = () => {
  const [sceneState, _] = useState(() => getState());
  return { sceneState };
};

// src/index.ts
function useExample() {
  return "react-0.0.0";
}

export { SceneStateProvider, useExample, useSceneState };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map