import { create } from 'zustand';
import { AdminState, WebinarSlot, WebinarLog, TransitionState } from '@/types/webinar';

interface WebinarStore extends AdminState {
  transitionState: TransitionState;
  setGoLiveEnabled: (enabled: boolean) => void;
  setActiveSlot: (slotId: string | null) => void;
  updateSlot: (slot: Partial<WebinarSlot> & { id: string }) => void;
  addLog: (log: Omit<WebinarLog, 'id'>) => void;
  setTransitionState: (state: Partial<TransitionState>) => void;
  initializeSlots: (slots: WebinarSlot[]) => void;
}

export const useWebinarStore = create<WebinarStore>((set, get) => ({
  // Initial state
  isGoLiveEnabled: false,
  activeSlotId: null,
  slots: [],
  logs: [],
  transitionState: {
    isTransitioning: false,
    transitionMessage: '',
    targetMode: 'replay',
  },

  // Actions
  setGoLiveEnabled: (enabled: boolean) => {
    set({ isGoLiveEnabled: enabled });
    get().addLog({
      slotId: get().activeSlotId || 'system',
      timestamp: new Date().toISOString(),
      event: 'admin_action',
      details: `Go Live ${enabled ? 'enabled' : 'disabled'}`,
    });
  },

  setActiveSlot: (slotId: string | null) => {
    set({ activeSlotId: slotId });
  },

  updateSlot: (slotUpdate) => {
    set((state) => ({
      slots: state.slots.map((slot) =>
        slot.id === slotUpdate.id ? { ...slot, ...slotUpdate } : slot
      ),
    }));
  },

  addLog: (logData) => {
    const log: WebinarLog = {
      ...logData,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      logs: [...state.logs, log].slice(-100), // Keep last 100 logs
    }));
  },

  setTransitionState: (stateUpdate) => {
    set((state) => ({
      transitionState: { ...state.transitionState, ...stateUpdate },
    }));
  },

  initializeSlots: (slots) => {
    set({ slots });
  },
}));