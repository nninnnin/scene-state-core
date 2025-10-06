import {
  DEFAULT_TRANSFORM,
  type Transform,
  type EntityId,
} from "@ssc/core";
import { useSetAtom } from "jotai";
import { setSelectedEntityIdAtom } from "../../panels/property-panel/propertyAtoms";

const EntityMesh = ({
  id,
  transform = DEFAULT_TRANSFORM,
}: {
  id: EntityId;
  transform?: Transform;
}) => {
  const setSelectedEntityId = useSetAtom(
    setSelectedEntityIdAtom,
  );

  const handleClick = (e) => {
    console.log("entity id: ", id);
    setSelectedEntityId(id);
  };

  return (
    <mesh
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
      onClick={handleClick}
    >
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default EntityMesh;
