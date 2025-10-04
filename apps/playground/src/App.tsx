import { useSceneState } from "@ssc/react";
import { Canvas } from "@react-three/fiber";

import EntityMesh from "./scene/components/EntityMesh";
import PropertyPanel from "./panels/property-panel/PropertyPanel";
import Toolbar from "./panels/toolbar-panel/Toolbar";

function App() {
  const { sceneState } = useSceneState();

  const meshes = Object.entries(
    sceneState.entities,
  ).map(([entityId, _]) => {
    const transform =
      sceneState.components.transform[entityId];

    return (
      <EntityMesh
        key={`entity-${entityId}`}
        id={entityId}
        transform={transform}
      />
    );
  });

  return (
    <div
      id="app-container"
      className="flex flex-col h-[100dvh]"
    >
      <PropertyPanel />

      <Canvas className="flex-1">
        {meshes}

        <ambientLight intensity={5} />
        {/* <OrbitControls /> */}
      </Canvas>

      <Toolbar />
    </div>
  );
}

export default App;
