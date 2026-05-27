// License Monitor Edge Function
// Monitors license expirations and certifications

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://zygoqqsgzhgpvlpttfbk.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 86400000).toISOString().split("T")[0];
    const today = now.toISOString().split("T")[0];

    const results: {
      expiring_licenses: number;
      expired_licenses: number;
      upcoming_audits: number;
      checked_at: string;
    } = {
      expiring_licenses: 0,
      expired_licenses: 0,
      upcoming_audits: 0,
      checked_at: now.toISOString()
    };

    // Check expiring licenses
    const { data: expiring } = await supabase
      .from("licenses")
      .select("*, profiles(full_name, email)")
      .lte("expiry_date", thirtyDaysFromNow)
      .eq("status", "active");

    if (expiring && expiring.length > 0) {
      results.expiring_licenses = expiring.length;

      // Create notifications for expiring licenses
      for (const license of expiring) {
        await supabase.from("notifications").insert({
          user_id: license.user_id,
          type: "license_expiry",
          title: `License Expiring: ${license.license_type}`,
          body: `Your ${license.license_type} license (${license.license_number}) expires on ${license.expiry_date}. Renew now.`,
          priority: "high",
          source_portal: "system",
          target_portal: "user"
        });
      }
    }

    // Check expired licenses
    const { data: expired } = await supabase
      .from("licenses")
      .select("id, user_id")
      .lt("expiry_date", today)
      .eq("status", "active");

    if (expired && expired.length > 0) {
      results.expired_licenses = expired.length;

      for (const license of expired) {
        await supabase.from("licenses").update({ status: "expired" }).eq("id", license.id);
      }
    }

    // Check certification audits
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 86400000).toISOString().split("T")[0];
    const { data: audits } = await supabase
      .from("certifications")
      .select("*, profiles(full_name, email)")
      .lte("next_audit_date", fourteenDaysFromNow)
      .eq("status", "active");

    if (audits && audits.length > 0) {
      results.upcoming_audits = audits.length;

      for (const cert of audits) {
        await supabase.from("notifications").insert({
          user_id: cert.user_id,
          type: "certification_reminder",
          title: `Audit Due: ${cert.cert_type}`,
          body: `Your ${cert.cert_type} certification audit is scheduled for ${cert.next_audit_date}.`,
          priority: "high",
          source_portal: "system",
          target_portal: "user"
        });
      }
    }

    return new Response(JSON.stringify({ success: true, ...results }), {
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