import { create } from "zustand";

export interface LogEntry {
  id: string;
  kind: "info" | "warning" | "error";
  text: string;
}

interface RuntimeState {
  building: boolean;
  logs: LogEntry[];
  requestId: number;
  setBuilding: (building: boolean) => void;
  appendLog: (kind: LogEntry["kind"], text: string) => void;
  clearLogs: () => void;
  requestBuild: () => void;
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  building: false,
  logs: [],
  requestId: 0,

  setBuilding(building) {
    set({ building });
  },

  requestBuild() {
    set((state) => ({ requestId: state.requestId + 1 }));
  },

  appendLog(kind, text) {
    set((state) => ({
      logs: [
        ...state.logs,
        { id: crypto.randomUUID(), kind, text },
      ],
    }));
  },

  clearLogs() {
    set({ logs: [] });
  },
}));
