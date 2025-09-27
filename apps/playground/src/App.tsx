import clsx from "clsx";
import { useCommand, useSceneState } from "@ssc/react";
import {
  AddEntityCommand,
  version as coreVersion,
} from "@ssc/core";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import EntityMesh from "./components/EntityMesh";

function App() {
  const { sceneState } = useSceneState();
  const { dispatch } = useCommand();

  const handleAddEntityClick = () => {
    const random = Math.random() * 100;

    const entityId = "my-id" + random;
    const entityName = "Justin" + random;

    dispatch(
      new AddEntityCommand(entityId, entityName),
    );
  };

  const meshes = Object.entries(
    sceneState.entities,
  ).map(([entityId, _]) => {
    const transform =
      sceneState.components.transform[entityId];

    return (
      <EntityMesh
        key={`entity-${entityId}`}
        transform={transform}
      />
    );
  });

  return (
    <div className="flex flex-col h-[100dvh]">
      <div
        id="navigation-bar"
        className="bg-gray-100 p-3"
      >
        core: {coreVersion()}
      </div>

      <Canvas className="flex-1">
        {meshes}

        <ambientLight />
        <OrbitControls />
      </Canvas>

      <div
        id="button-container"
        className="bg-gray-100 p-5"
      >
        <button
          className={clsx(
            "bg-amber-200 p-3 px-2 rounded-xl",
          )}
          onClick={handleAddEntityClick}
        >
          엔티티 추가
        </button>
      </div>
    </div>
  );
}

export default App;
