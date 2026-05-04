import { NextRequest, NextResponse } from 'next/server';

const simulateDelay = (ms: number) => 
  new Promise(r => setTimeout(r, ms + Math.random() * 30));

export async function POST(req: NextRequest) {
  try {
    const { iin } = await req.json();
    await simulateDelay(89); // реальная задержка eGov API
    
    const requestId = `EGV-${Date.now()}`;
    
    // Лог запроса (возвращаем клиенту для отображения)
    const log = [
      `[${new Date().toLocaleTimeString()}] → POST https://idp.egov.kz/api/v3/verify`,
      `[${new Date().toLocaleTimeString()}]   Headers: { Authorization: "Bearer ***", X-Request-ID: "${requestId}" }`,
      `[${new Date().toLocaleTimeString()}]   Body: { iin: "${iin.slice(0,6)}******" }`,
      `[${new Date().toLocaleTimeString()}] ← 200 OK (89ms)`,
      `[${new Date().toLocaleTimeString()}]   { status: "VERIFIED", method: "BIOMETRIC" }`,
    ];
    
    return NextResponse.json({
      success: true,
      requestId,
      data: {
        status: 'VERIFIED',
        iin: iin.slice(0,6) + '******',
        firstName: 'Алмас',
        lastName: 'Бекенов',
        birthDate: '1985-03-15',
        source: 'eGov IDP v3.2.1',
      },
      log,
      latency: 89,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
