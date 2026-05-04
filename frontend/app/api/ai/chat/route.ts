import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, servicesContext } = await req.json();
    
    const systemPrompt = `Ты — дружелюбный ассистент портала господдержки "Байтерек" в Казахстане.
    Отвечай кратко (2-4 предложения). Только на русском языке.
    Помогаешь предпринимателям найти нужную меру господдержки.
    Контекст доступных услуг: ${JSON.stringify(servicesContext?.slice(0, 10))}`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.content
      }))
    ];
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-77b1e7281c92451abf6462bc2ce44131`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: formattedMessages,
        temperature: 0.7
      }),
    });
    
    const data = await response.json();
    return NextResponse.json({ message: data.choices?.[0]?.message?.content });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
