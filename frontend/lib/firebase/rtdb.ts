import { ref, onValue } from 'firebase/database';
import { rtdb } from './config';

export const subscribeToMetrics = (cb: (m: any) => void) =>
  onValue(ref(rtdb, 'metrics'), snap => cb(snap.val()));

export const subscribeToLiveEvents = (cb: (events: any[]) => void) =>
  onValue(ref(rtdb, 'liveEvents'), snap => {
    const data = snap.val();
    const events = data
      ? Object.entries(data)
          .map(([id, e]: any) => ({ id, ...e }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 20)
      : [];
    cb(events);
  });

export const subscribeToIntegrationStatus = (cb: (s: any) => void) =>
  onValue(ref(rtdb, 'integrationStatus'), snap => cb(snap.val()));

// Dummy simulation for frontend if backend doesn't run it
export const startMetricsSimulation = () => {
  console.log("Firebase simulation should be run from backend.");
};
