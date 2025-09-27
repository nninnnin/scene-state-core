import {
  DEFAULT_TRANSFORM,
  type Transform,
} from "@ssc/core";

const EntityMesh = ({
  transform = DEFAULT_TRANSFORM,
}: {
  transform?: Transform;
}) => {
  return (
    <mesh
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
    >
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default EntityMesh;
