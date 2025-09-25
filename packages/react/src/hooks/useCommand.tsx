import { Command, group } from "@ssc/core";

import { useHistory } from "./useHistory";

export const useCommand = () => {
  const { historyManager } = useHistory();

  const dispatch = (command: Command) =>
    historyManager.execute(command);

  return {
    dispatch,
    group,
  };
};
