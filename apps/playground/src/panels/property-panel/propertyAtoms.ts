import { atom } from "jotai";
import { selectedEntityIdAtom } from "../../common/atoms/editorAtoms";

export const getSelectedEntityIdAtom = atom((get) => {
  return get(selectedEntityIdAtom);
});

export const setSelectedEntityIdAtom = atom(
  null,
  (_, set, newValue: string) => {
    set(selectedEntityIdAtom, newValue);
  },
);
