import { Command, group } from "@ssc/core";

import useStore from "./useStore";

export const useCommand = () => {
  const { store } = useStore();

  const dispatch = (command: Command) =>
    store.dispatch(command);

  return {
    dispatch,
    group,
  };
};
