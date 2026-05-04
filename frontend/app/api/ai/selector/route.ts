import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { answers, services } = await req.json();
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-77b1e7281c92451abf6462bc2ce44131`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        response_format: { type: "json_object" },
        messages: [{
          role: 'system',
          content: `Ты — эксперт по государственной поддержке бизнеса в Казахстане от холдинга Байтерек.
          Анализируй профиль бизнеса и подбирай подходящие меры поддержки.
          Отвечай ТОЛЬКО валидным JSON без markdown и лишнего текста.
          Формат: { "summary": "...", "services": [{ "id": "id", "matchScore": 95, "reason": "..." }] }
          Топ 4 услуги.`
        }, {
          role: 'user',
          content: `Профиль бизнеса: ${JSON.stringify(answers)}
          Доступные услуги: ${JSON.stringify(services)}`
        }],
        temperature: 0.2
      }),
    });
    
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    try {
      const result = JSON.parse(text || '{}');
      return NextResponse.json(result);
    } catch {
      return NextResponse.json({ error: 'AI parsing error' }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
