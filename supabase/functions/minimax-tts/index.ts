// MiniMax TTS Edge Function
// Text-to-Speech via MiniMax API

const MINIMAX_API_KEY = Deno.env.get('MINIMAX_API_KEY') || '';

interface TTSRequest {
  text: string;
  voice_id?: string;
  speed?: number;
  vol?: number;
  pitch?: number;
  sample_rate?: number;
  bitrate?: number;
}

const VOICE_OPTIONS: Record<string, string> = {
  'male-qn-qingse': 'male-qn-qingse',
  'female-shaonv': 'female-shaonv',
  'male-yunyang': 'male-yunyang',
  'female-xiaobei': 'female-xiaobei',
};

async function textToSpeech(text: string, options: {
  voiceId: string;
  speed: number;
  vol: number;
  pitch: number;
  sampleRate: number;
  bitrate: number;
}) {
  const apiUrl = 'https://api.minimaxi.chat/v1/t2a_v2';

  const payload = {
    model: 'speech-01-turbo',
    text: text,
    voice_setting: {
      voice_id: options.voiceId,
      speed: options.speed,
      vol: options.vol,
      pitch: options.pitch,
    },
    audio_setting: {
      sample_rate: options.sampleRate,
      bitrate: options.bitrate,
      format: 'mp3',
      channel: 1,
    },
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
    throw new Error(`MiniMax TTS error: ${error}`);
  }

  return response.arrayBuffer();
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
    const { text, voice_id, speed, vol, pitch, sample_rate, bitrate } = await req.json() as TTSRequest;

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: 'text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const audioBuffer = await textToSpeech(text, {
      voiceId: voice_id || 'male-qn-qingse',
      speed: speed ?? 1.0,
      vol: vol ?? 1.0,
      pitch: pitch ?? 0,
      sampleRate: sample_rate ?? 24000,
      bitrate: bitrate ?? 128000,
    });

    // Return audio as binary
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="tts.mp3"',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
