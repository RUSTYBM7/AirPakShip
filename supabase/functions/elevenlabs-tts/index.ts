// ElevenLabs TTS Edge Function
// Text-to-Speech via ElevenLabs API

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY') || 'sk_abc1960db5c46d3bc85c6a8b4aee7bb2cd7b10e972d2e329';

interface TTSRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

// Default voice (Rachel - popular English voice)
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

async function textToSpeech(text: string, options: {
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}) {
  const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId}`;

  const payload = {
    text: text,
    model_id: options.modelId || 'eleven_multilingual_v2',
    voice_settings: {
      stability: options.stability,
      similarity_boost: options.similarityBoost,
      style: options.style,
      use_speaker_boost: options.useSpeakerBoost,
    },
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs TTS error: ${error}`);
  }

  return response.arrayBuffer();
}

// Get available voices
async function getVoices() {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch voices');
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

  // Handle GET for voices list
  if (req.method === 'GET') {
    try {
      const voices = await getVoices();
      return new Response(
        JSON.stringify({ success: true, voices: voices.voices || [] }),
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
  }

  try {
    const { text, voice_id, model_id, stability, similarity_boost, style, use_speaker_boost } = await req.json() as TTSRequest;

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: 'text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const audioBuffer = await textToSpeech(text, {
      voiceId: voice_id || DEFAULT_VOICE_ID,
      modelId: model_id || 'eleven_multilingual_v2',
      stability: stability ?? 0.5,
      similarityBoost: similarity_boost ?? 0.75,
      style: style ?? 0.0,
      useSpeakerBoost: use_speaker_boost ?? true,
    });

    // Return audio as binary
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="elevenlabs-tts.mp3"',
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
