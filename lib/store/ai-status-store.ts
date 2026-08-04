import { create } from "zustand";

type AiStatusState = {
  available: boolean | null;
  cooldownRemainingSeconds: number;
  setStatus: (available: boolean, cooldownRemainingSeconds: number) => void;
  markUnavailable: () => void;
};

export const useAiStatusStore = create<AiStatusState>((set) => ({
  available: null,
  cooldownRemainingSeconds: 0,
  setStatus: (available, cooldownRemainingSeconds) =>
    set({ available, cooldownRemainingSeconds }),
  markUnavailable: () =>
    set({ available: false, cooldownRemainingSeconds: -1 }),
}));
