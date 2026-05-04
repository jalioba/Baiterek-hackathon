import { NextRequest, NextResponse } from 'next/server';

const simulateDelay = (ms: number) => 
  new Promise(r => setTimeout(r, ms + Math.random() * 30));

const now = () => new Date().toLocaleTimeString('ru-RU');
const getOrganizationBPM = (serviceId: string) => "DAMU_BPM";
const getEstimatedDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export async function POST(req: NextRequest) {
  try {
    const { applicationId, serviceId } = await req.json();
    await simulateDelay(341);
    
    const bpmId = `BPM-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    
    const log = [
      `[${now()}] → POST https://eish.baiterek.kz/api/bpm/submit`,
      `[${now()}]   Routing to: BPM Oracle 12c (${getOrganizationBPM(serviceId)})`,
      `[${now()}] ← 200 OK (341ms)`,
      `[${now()}]   BPM ID: ${bpmId}`,
      `[${now()}]   Queue: Assigned to pool "CREDIT_ANALYSTS"`,
      `[${now()}] → POST https://eish.baiterek.kz/api/notify/sms`,
      `[${now()}] ← 200 OK | SMS queued for delivery`,
    ];
    
    return NextResponse.json({
      success: true,
      bpmId,
      status: 'REGISTERED',
      queuePosition: Math.floor(Math.random() * 20 + 1),
      estimatedDate: getEstimatedDate(15),
      assignedPool: 'CREDIT_ANALYSTS',
      log,
      latency: 341,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const bpmId = req.nextUrl.searchParams.get('bpmId');
  await simulateDelay(200);
  
  // Симулируем прогресс по времени
  const statuses = ['REGISTERED', 'UNDER_REVIEW', 'DOCUMENT_CHECK', 'DECISION'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return NextResponse.json({
    bpmId,
    currentStatus: randomStatus,
    currentStage: 'Финансовый анализ',
    responsible: 'Сейтжан А.К.',
    lastUpdated: new Date().toISOString(),
    progress: Math.floor(Math.random() * 60 + 20),
  });
}
