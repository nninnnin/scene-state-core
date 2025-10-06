import { atom } from "jotai";

export const selectedEntityIdAtom = atom<
  string | null
>(null);
