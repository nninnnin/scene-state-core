import {
  createContext,
  PropsWithChildren,
  RefObject,
  useRef,
} from "react";
import {
  HistoryManager,
  State,
  Store,
} from "@ssc/core";

type ProviderProps = PropsWithChildren<{
  initialState: State;
  injectedStore?: Store;
}>;

type StoreRef = RefObject<Store | null>;
type HistoryRef = RefObject<HistoryManager | null>;

export const StoreContext =
  createContext<StoreRef | null>(null);

export const HistoryContext =
  createContext<HistoryRef | null>(null);

export const SceneStateProvider = ({
  initialState,
  injectedStore,
  children,
}: ProviderProps) => {
  const storeRef = useRef<Store | null>(null);
  const historyRef = useRef<HistoryManager | null>(
    null,
  );

  if (injectedStore) {
    storeRef.current = injectedStore;
  } else if (!storeRef.current) {
    // Remove null race
    storeRef.current = new Store(initialState);
  }

  if (!historyRef.current) {
    historyRef.current = new HistoryManager(
      storeRef.current,
    );
  }

  return (
    <StoreContext.Provider value={storeRef}>
      <HistoryContext.Provider value={historyRef}>
        {children}
      </HistoryContext.Provider>
    </StoreContext.Provider>
  );
};
