// User Assistant Edge Function
// AI-powered assistant with user context from Supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://zygoqqsgzhgpvlpttfbk.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MINIMAX_API_KEY = Deno.env.get("MINIMAX_API_KEY") || "";

const MINIMAX_URL = "https://api.minimaxi.chat/v1/text/chatcompletion_v2";

interface ChatRequest {
  user_id?: string;
  message: string;
  conversation_id?: string;
  context?: Record<string, unknown>;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { user_id, message, conversation_id }: ChatRequest = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ success: false, error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Build context
    let systemPrompt = `You are AirPak Express AI Assistant. Help users with:
- Tracking shipments (ask for tracking number)
- Creating new shipments
- Understanding services and pricing
- Account management
- General logistics questions

Keep responses concise, friendly, and helpful.`;

    if (user_id) {
      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user_id)
        .single();

      if (profile) {
        // Fetch recent shipments
        const { data: shipments } = await supabase
          .from("shipments")
          .select("tracking_number, status")
          .eq("user_id", user_id)
          .order("created_at", { ascending: false })
          .limit(5);

        systemPrompt = `You are AirPak Express AI Assistant for ${profile.full_name || 'Customer'}.
User tier: ${profile.tier || 'basic'}.
Active shipments: ${shipments?.length || 0}
${shipments?.length ? `Recent tracking numbers: ${shipments.map(s => s.tracking_number).join(', ')}` : ''}

Help with tracking, shipping, account questions. Keep responses concise and friendly.`;
      }
    }

    // Call MiniMax API
    const response = await fetch(MINIMAX_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MINIMAX_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`MiniMax API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I apologize, I couldn't help with that.";

    // Save conversation if provided
    if (conversation_id && user_id) {
      await supabase.from("assistant_messages").insert({
        conversation_id,
        user_id,
        role: "user",
        content: message
      });

      await supabase.from("assistant_messages").insert({
        conversation_id,
        user_id,
        role: "assistant",
        content: aiResponse,
        model: "MiniMax-Text-01"
      });
    }

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse,
      tokens_used: data.usage?.total_tokens
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
});