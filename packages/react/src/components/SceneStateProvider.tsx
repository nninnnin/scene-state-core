import {
  createContext,
  PropsWithChildren,
  RefObject,
  useRef,
} from "react";
import { State, Store } from "@ssc/core";

type ProviderProps = PropsWithChildren<{
  initialState: State;
  injectedStore?: Store;
}>;

type StoreRef = RefObject<Store | null>;

export const StoreContext =
  createContext<StoreRef | null>(null);

export const SceneStateProvider = ({
  initialState,
  injectedStore,
  children,
}: ProviderProps) => {
  const storeRef = useRef<Store | null>(null);

  if (injectedStore) {
    storeRef.current = injectedStore;
  } else if (!storeRef.current) {
    // Remove null race
    storeRef.current = new Store(initialState);
  }

  return (
    <StoreContext.Provider value={storeRef}>
      {children}
    </StoreContext.Provider>
  );
};
