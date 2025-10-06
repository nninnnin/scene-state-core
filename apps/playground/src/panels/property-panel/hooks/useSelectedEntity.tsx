import { useStore } from "@ssc/react";
import { useAtomValue } from "jotai";

import { getSelectedEntityIdAtom } from "../propertyAtoms";

const useSelectedEntity = () => {
  const { store } = useStore();

  const selectedEntityId = useAtomValue(
    getSelectedEntityIdAtom,
  );

  const selectedEntity = store.getEntity(
    selectedEntityId,
  );

  return {
    selectedEntity,
  };
};

export default useSelectedEntity;
