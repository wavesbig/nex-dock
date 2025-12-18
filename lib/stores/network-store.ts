import { createStore } from "zustand/vanilla"

type NetworkState = {
  intranet: boolean
}

type NetworkActions = {
  toggle: () => void
  set: (v: boolean) => void
}

export type NetworkStore = NetworkState & NetworkActions

export const networkStore = createStore<NetworkStore>()((set) => ({
  intranet: false,
  toggle: () => set((s) => ({ intranet: !s.intranet })),
  set: (v) => set({ intranet: v }),
}))

