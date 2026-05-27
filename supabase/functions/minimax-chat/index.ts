// MiniMax Chat API Edge Function
// Provides AI chat completion via MiniMax API

const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY') || '';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

const DEFAULT_MODEL = 'MiniMax-Text-01';

async function chatCompletion(messages: ChatMessage[], model: string, temperature: number, maxTokens: number) {
  const apiUrl = 'https://api.minimaxi.chat/v1/text/chatcompletion_v2';

  const payload = {
    model: model || DEFAULT_MODEL,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
    temperature: temperature ?? 0.7,
    max_tokens: maxTokens ?? 1024,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${error}`);
  }

  return response.json();
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    const { messages, model, temperature, max_tokens } = await req.json() as ChatRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await chatCompletion(messages, model || DEFAULT_MODEL, temperature ?? 0.7, max_tokens ?? 1024);

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
