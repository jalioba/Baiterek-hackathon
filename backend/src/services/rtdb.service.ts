import { rtdb } from '../config/firebase';

// ════════════════════════════════════════
// LIVE МЕТРИКИ
// ════════════════════════════════════════

export const initializeMetrics = async () => {
  const snap = await rtdb.ref('metrics').get();
  if (!snap.exists()) {
    await rtdb.ref('metrics').set({
      todayApplications: 47,
      activeUsers: 2847,
      totalApproved: 1234,
      totalVolume: 18.4,
      satisfactionRate: 94.2,
      lastUpdated: Date.now(),
    });
  }
};

export const incrementMetric = async (key: string, amount = 1) => {
  const ref = rtdb.ref(`metrics/${key}`);
  await ref.transaction((current) => (current || 0) + amount);
};

export const updateMetrics = async (data: Record<string, any>) => {
  await rtdb.ref('metrics').update({ ...data, lastUpdated: Date.now() });
};

// ════════════════════════════════════════
// LIVE СОБЫТИЯ
// ════════════════════════════════════════

export const pushLiveEvent = async (type: string, message: string) => {
  const ref = rtdb.ref('liveEvents').push();
  await ref.set({ type, message, timestamp: Date.now() });
  
  // Чистим старые события — держим только последние 100
  const allEventsSnap = await rtdb.ref('liveEvents').orderByChild('timestamp').get();
  const allEvents = allEventsSnap.val();
  if (allEvents) {
    const keys = Object.keys(allEvents);
    if (keys.length > 100) {
      const toDelete = keys.slice(0, keys.length - 100);
      const updates: Record<string, null> = {};
      toDelete.forEach(k => { updates[k] = null; });
      await rtdb.ref('liveEvents').update(updates);
    }
  }
};

// ════════════════════════════════════════
// СТАТУС ИНТЕГРАЦИЙ
// ════════════════════════════════════════

const BASE_LATENCIES: Record<string, number> = {
  eish: 124, egov: 89, bpm: 341, nca: 67, crm: 512, sms: 34,
};

export const initializeIntegrationStatus = async () => {
  const initial: Record<string, any> = {};
  Object.entries(BASE_LATENCIES).forEach(([sys, lat]) => {
    initial[sys] = {
      status: 'online',
      avgLatency: lat,
      requestsPerHour: Math.floor(Math.random() * 800 + 100),
      uptime: parseFloat((99.7 + Math.random() * 0.29).toFixed(2)),
    };
  });
  await rtdb.ref('integrationStatus').set(initial);
};

export const fluctuateIntegrationMetrics = async () => {
  const updates: Record<string, any> = {};
  Object.entries(BASE_LATENCIES).forEach(([sys, base]) => {
    updates[sys] = {
      status: 'online',
      avgLatency: base + Math.floor(Math.random() * 30 - 15),
      requestsPerHour: Math.floor(Math.random() * 800 + 100),
      uptime: parseFloat((99.7 + Math.random() * 0.29).toFixed(2)),
    };
  });
  await rtdb.ref('integrationStatus').update(updates);
};

// ════════════════════════════════════════
// СИМУЛЯТОР — запускается при старте сервера
// ════════════════════════════════════════

const KAZAKH_NAMES = [
  'Нурлан А.', 'Айгерим С.', 'Серик Б.', 'Зарина Т.',
  'Бауыржан М.', 'Гульнара К.', 'Асхат Ж.', 'Дина Ш.',
];

const EVENT_TEMPLATES = [
  () => ({ type: 'application', message: `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)} → статус: UNDER_REVIEW` }),
  () => ({ type: 'user', message: `Новый пользователь: ${KAZAKH_NAMES[Math.floor(Math.random() * KAZAKH_NAMES.length)]} (ТОО)` }),
  () => ({ type: 'document', message: `Документ подписан ЭЦП: DOC-${Math.floor(Math.random() * 9000 + 1000)}` }),
  () => ({ type: 'approved', message: `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)} → APPROVED ✅` }),
  () => ({ type: 'bpm', message: `BPM Oracle: заявка передана аналитику` }),
  () => ({ type: 'egov', message: `eGov IDP: верификация ИИН ***${Math.floor(Math.random() * 900 + 100)}` }),
  () => ({ type: 'sms', message: `SMS Gateway: уведомление доставлено (+7 7** *** ** **)` }),
];

export const startSimulation = () => {
  console.log('🔥 Starting Firebase RTDB simulation...');
  
  // Флуктуации метрик каждые 15 сек
  setInterval(async () => {
    try {
      const snap = await rtdb.ref('metrics').get();
      const current = snap.val() || {};
      await rtdb.ref('metrics').update({
        todayApplications: (current.todayApplications || 47) + Math.floor(Math.random() * 2),
        activeUsers: Math.max(100, (current.activeUsers || 2847) + Math.floor(Math.random() * 20 - 10)),
        totalApproved: (current.totalApproved || 1234) + (Math.random() > 0.7 ? 1 : 0),
        totalVolume: parseFloat(((current.totalVolume || 18.4) + Math.random() * 0.05).toFixed(2)),
        satisfactionRate: parseFloat((91 + Math.random() * 6).toFixed(1)),
        lastUpdated: Date.now(),
      });
    } catch (e) { /* ignore */ }
  }, 15000);
  
  // Новые события каждые 8 сек
  setInterval(async () => {
    try {
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const event = template();
      await pushLiveEvent(event.type, event.message);
    } catch (e) { /* ignore */ }
  }, 8000);
  
  // Флуктуации интеграций каждые 10 сек
  setInterval(async () => {
    try { await fluctuateIntegrationMetrics(); }
    catch (e) { /* ignore */ }
  }, 10000);
};
