'use strict';

var react = require('react');
var core = require('@ssc/core');
var jsxRuntime = require('react/jsx-runtime');

// src/SceneStateProvider.tsx
var SceneStateProvider = ({
  initialState,
  children
}) => {
  const inited = react.useRef(false);
  react.useEffect(() => {
    if (!inited.current) {
      core.init(initialState);
      inited.current = true;
    }
  }, [initialState]);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
};
var useSceneState = () => {
  const [sceneState, _] = react.useState(() => core.getState());
  return { sceneState };
};

// src/index.ts
function useExample() {
  return "react-0.0.0";
}

exports.SceneStateProvider = SceneStateProvider;
exports.useExample = useExample;
exports.useSceneState = useSceneState;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map