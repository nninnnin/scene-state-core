import clsx from 'clsx';
import { useCommand, useSceneState } from '@ssc/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AddEntityCommand, version as coreVersion } from '@ssc/core';

function App() {
  const { sceneState } = useSceneState();

  console.log('default scene state: ', sceneState);

  const { dispatch } = useCommand();

  const handleAddEntityClick = () => {
    dispatch(new AddEntityCommand('my-id', 'Justin'));
  };

  return (
    <div className="flex flex-col h-[100dvh]">
      <div id="navigation-bar" className="bg-gray-100 p-3">
        core: {coreVersion()}
      </div>

      <Canvas className="flex-1">
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>

        <ambientLight />
        <OrbitControls />
      </Canvas>

      <div id="button-container" className="bg-gray-100 p-5">
        <button
          className={clsx('bg-amber-200 p-3 px-2 rounded-xl')}
          onClick={handleAddEntityClick}
        >
          엔티티 추가
        </button>
      </div>
    </div>
  );
}

export default App;
