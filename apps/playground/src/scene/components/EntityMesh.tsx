import {
  DEFAULT_TRANSFORM,
  type Transform,
  type EntityId,
} from "@ssc/core";

const EntityMesh = ({
  id,
  transform = DEFAULT_TRANSFORM,
}: {
  id: EntityId;
  transform?: Transform;
}) => {
  return (
    <mesh
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
      onClick={(e) => console.log("entity id: ", id)}
    >
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default EntityMesh;
