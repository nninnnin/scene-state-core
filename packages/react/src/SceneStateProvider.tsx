import {
  PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { init, State } from "@ssc/core";

type ProviderProps = PropsWithChildren<{
  initialState: State;
}>;

export const SceneStateProvider = ({
  initialState,
  children,
}: ProviderProps) => {
  const inited = useRef(false);

  useEffect(() => {
    if (!inited.current) {
      init(initialState);
      inited.current = true;
    }
  }, [initialState]);

  return <>{children}</>;
};
