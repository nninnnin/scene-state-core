import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SceneStateProvider } from "@ssc/react";
import {
  addEntity,
  createEmptyState,
  setTransform,
} from "@ssc/core";

import App from "./App.tsx";
import "./index.css";

const initial = (() => {
  let s = createEmptyState();
  s = addEntity(s, "box1", "First Box");
  s = setTransform(s, "box1", {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  });
  s = addEntity(s, "box2", "Second Box");
  s = setTransform(s, "box2", {
    position: [2, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 2, 1],
  });
  return s;
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SceneStateProvider initialState={initial}>
      <App />
    </SceneStateProvider>
  </StrictMode>,
);
