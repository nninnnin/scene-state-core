import { Canvas } from "@react-three/fiber";
import "./App.css";

import { version as coreVersion } from "@ssc/core";
import { OrbitControls } from "@react-three/drei";

function App() {
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
