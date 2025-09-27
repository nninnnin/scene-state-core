import type { Transform } from "@ssc/core";

const EntityMesh = ({
  transform,
}: {
  transform: Transform;
}) => {
  return (
    <mesh
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};

export default EntityMesh;
