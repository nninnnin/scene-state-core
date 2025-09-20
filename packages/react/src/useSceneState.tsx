import { useState } from "react";
import { getState } from "@ssc/core";

export const useSceneState = () => {
  const [sceneState, _] = useState(() => getState());

  return { sceneState };
};
