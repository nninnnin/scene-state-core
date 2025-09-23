import { useContext } from "react";
import { StoreContext } from "../components/SceneStateProvider";

const useStore = () => {
  const storeRef = useContext(StoreContext);

  if (!storeRef?.current) {
    throw new Error(
      "SceneStateProvider is not mounted and no global store available. " +
        "Wrap your app with <SceneStateProvider initialState={...}> or pass an injectedStore in tests.",
    );
  }

  return {
    store: storeRef.current,
  };
};

export default useStore;
