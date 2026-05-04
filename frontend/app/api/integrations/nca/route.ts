import { NextRequest, NextResponse } from 'next/server';

const simulateDelay = (ms: number) => 
  new Promise(r => setTimeout(r, ms + Math.random() * 30));

const generateGOSTHash = () => {
  const chars = '0123456789abcdef';
  return Array.from({length: 64}, () => chars[Math.floor(Math.random() * 16)]).join('');
};

export async function POST(req: NextRequest) {
  try {
    const { documents, pin } = await req.json();
    await simulateDelay(67);
    
    // Проверка PIN (мок — любой 4+ символьный PIN принимается)
    if (!pin || pin.length < 4) {
      return NextResponse.json({ success: false, error: 'Неверный PIN-код' }, { status: 400 });
    }
    
    const signedDocs = documents.map((docName: string) => ({
      document: docName,
      signature: generateGOSTHash(),
      algorithm: 'GOST3410_2015_512',
      certificate: 'GOST_RSA_2048_AUTH',
      certOwner: 'БЕКЕНОВ АЛМАС ЕРЖАНОВИЧ',
      certExpiry: '2025-12-31',
      timestamp: new Date().toISOString(),
      tsp: `TSP-${Date.now()}`, // Time Stamp Protocol token
    }));
    
    return NextResponse.json({
      success: true,
      signedDocuments: signedDocs,
      sessionId: `NCA-SESSION-${Date.now()}`,
      latency: 67,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
