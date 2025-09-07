import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useWebinarStore } from './store';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class RealtimeManager {
  private unsubscribe: (() => void) | null = null;

  async initializeRealtimeSync() {
    try {
      // Listen to admin state changes
      const adminStateRef = doc(db, 'admin', 'state');
      
      this.unsubscribe = onSnapshot(adminStateRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const { setGoLiveEnabled, setActiveSlot } = useWebinarStore.getState();
          
          if (data.isGoLiveEnabled !== undefined) {
            setGoLiveEnabled(data.isGoLiveEnabled);
          }
          
          if (data.activeSlotId !== undefined) {
            setActiveSlot(data.activeSlotId);
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize realtime sync:', error);
    }
  }

  async updateAdminState(updates: { isGoLiveEnabled?: boolean; activeSlotId?: string }) {
    try {
      const adminStateRef = doc(db, 'admin', 'state');
      await updateDoc(adminStateRef, updates);
    } catch (error) {
      console.error('Failed to update admin state:', error);
    }
  }

  async logEvent(slotId: string, event: string, details: string, attendeeCount?: number) {
    try {
      const logRef = doc(db, 'logs', `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      await updateDoc(logRef, {
        slotId,
        timestamp: new Date().toISOString(),
        event,
        details,
        attendeeCount,
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManager();