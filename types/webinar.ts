export interface WebinarSlot {
  id: string;
  name: string;
  everwebinarUrl: string;
  zoomUrl: string;
  scheduledStartTime: string; // ISO string
  scheduledSwitchTime: string; // ISO string
  isActive: boolean;
  currentMode: 'replay' | 'live';
  attendeeCount: number;
  lastSwitchTime?: string;
}

export interface AdminState {
  isGoLiveEnabled: boolean;
  activeSlotId: string | null;
  slots: WebinarSlot[];
  logs: WebinarLog[];
}

export interface WebinarLog {
  id: string;
  slotId: string;
  timestamp: string;
  event: 'attendee_joined' | 'attendee_left' | 'mode_switched' | 'admin_action';
  details: string;
  attendeeCount?: number;
}

export interface TransitionState {
  isTransitioning: boolean;
  transitionMessage: string;
  targetMode: 'replay' | 'live';
}

export interface ZoomConfig {
  meetingNumber: string;
  userName: string;
  userEmail: string;
  passWord: string;
  leaveUrl: string;
  role: number; // 0 for attendee, 1 for host
}