import { Canvas } from '@react-three/fiber';

import { version as coreVersion } from '@ssc/core';
import { OrbitControls } from '@react-three/drei';
import { useSceneState } from '@ssc/react';

function App() {
  const { sceneState } = useSceneState();

  console.log('default scene state: ', sceneState);

  return (
    <>
      <div>core: {coreVersion()}</div>

      <Canvas style={{ height: 400 }}>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>

        <ambientLight />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
