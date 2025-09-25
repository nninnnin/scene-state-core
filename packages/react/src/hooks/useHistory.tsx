import { useContext } from "react";
import { HistoryContext } from "../components/SceneStateProvider";

export const useHistory = () => {
  const historyRef = useContext(HistoryContext);

  if (!historyRef?.current) {
    throw Error(
      "You should wrap the component with `SceneStateProvider` to use `useHistory`.",
    );
  }

  return {
    historyManager: historyRef.current,
  };
};
