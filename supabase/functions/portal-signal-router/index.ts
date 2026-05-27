// Portal Signal Router Edge Function
// Handles bidirectional signaling between user and admin portals

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://zygoqqsgzhgpvlpttfbk.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface SignalPayload {
  signal_type?: string;
  source?: string;
  target?: string;
  payload?: Record<string, unknown>;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    if (req.method === "GET") {
      // Get pending signals
      const { data: signals, error } = await supabase
        .from("portal_signals")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(50);

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        signals: signals || [],
        count: signals?.length || 0
      }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // POST - Create new signal
    const { signal_type, source, target, payload }: SignalPayload = await req.json();

    if (!signal_type || !source || !target) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields: signal_type, source, target"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const { data: signal, error } = await supabase
      .from("portal_signals")
      .insert({
        signal_type,
        source,
        target,
        payload: payload || {},
        status: "pending"
      })
      .select()
      .single();

    if (error) throw error;

    // Broadcast to relevant channels
    if (target === "admin_portal" || target === "both") {
      await supabase.channel("admin-signals").send({
        type: "broadcast",
        event: "portal_signal",
        payload: signal
      });
    }

    if (target === "user_portal" || target === "both") {
      await supabase.channel("user-signals").send({
        type: "broadcast",
        event: "portal_signal",
        payload: signal
      });
    }

    // Mark as processed
    await supabase
      .from("portal_signals")
      .update({ status: "completed", processed_at: new Date().toISOString() })
      .eq("id", signal.id);

    return new Response(JSON.stringify({
      success: true,
      signal,
      routed: true
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