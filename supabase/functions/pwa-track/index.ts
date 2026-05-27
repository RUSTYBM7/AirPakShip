/**
 * PWA Install Tracker Edge Function
 * Tracks PWA installations and engagement metrics
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PWAEvent {
  event: string;
  platform?: string;
  timestamp: string;
  user_agent?: string;
  device_info?: {
    os: string;
    browser: string;
    is_mobile: boolean;
    is_tablet: boolean;
    screen_width: number;
    screen_height: number;
  };
  install_context?: {
    referral_url?: string;
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  user_id?: string;
  device_id?: string;
}

interface InstallMetrics {
  user_id: string;
  platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'web' | 'other';
  install_date: string;
  first_session_date: string;
  sessions_count: number;
  last_active: string;
  notifications_enabled: boolean;
  push_subscribed: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create tables for PWA tracking if not exist
    await ensureTablesExist(supabase);

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'track':
        return await handleTrackEvent(req, supabase);

      case 'subscribe':
        return await handlePushSubscription(req, supabase);

      case 'unsubscribe':
        return await handlePushUnsubscription(req, supabase);

      case 'metrics':
        return await handleGetMetrics(req, supabase);

      case 'install':
        return await handleInstallEvent(req, supabase);

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function ensureTablesExist(supabase: any) {
  // Create pwa_events table
  await supabase.rpc('exec', {
    query: `
      CREATE TABLE IF NOT EXISTS public.pwa_events (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        event_type TEXT NOT NULL,
        user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        device_id TEXT,
        platform TEXT,
        user_agent TEXT,
        event_data JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `
  }).catch(() => {
    // Table might already exist, ignore error
  });

  // Create push_subscriptions table
  await supabase.rpc('exec', {
    query: `
      CREATE TABLE IF NOT EXISTS public.push_subscriptions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        endpoint TEXT NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        device_id TEXT,
        device_name TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, endpoint)
      );
    `
  }).catch(() => {});

  // Create pwa_install_metrics table
  await supabase.rpc('exec', {
    query: `
      CREATE TABLE IF NOT EXISTS public.pwa_install_metrics (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        platform TEXT NOT NULL,
        install_date DATE DEFAULT CURRENT_DATE,
        first_session_date DATE,
        sessions_count INTEGER DEFAULT 0,
        last_active TIMESTAMPTZ,
        notifications_enabled BOOLEAN DEFAULT false,
        push_subscribed BOOLEAN DEFAULT false,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, platform)
      );
    `
  }).catch(() => {});

  // Create RLS policies
  await supabase.rpc('exec', {
    query: `
      ALTER TABLE public.pwa_events ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.pwa_install_metrics ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "pwa_events_insert" ON public.pwa_events FOR INSERT WITH CHECK (true);
      CREATE POLICY "pwa_events_select" ON public.pwa_events FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
      CREATE POLICY "push_subs_all" ON public.push_subscriptions FOR ALL USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
      CREATE POLICY "metrics_all" ON public.pwa_install_metrics FOR ALL USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    `
  }).catch(() => {});
}

async function handleTrackEvent(req: Request, supabase: any) {
  const event: PWAEvent = await req.json();

  // Extract device info from user agent
  const deviceInfo = parseUserAgent(event.user_agent || '');

  // Insert event
  const { data, error } = await supabase
    .from('pwa_events')
    .insert({
      event_type: event.event,
      platform: event.platform || deviceInfo.os,
      user_agent: event.user_agent,
      event_data: {
        device_info: event.device_info || deviceInfo,
        install_context: event.install_context,
        timestamp: event.timestamp
      }
    })
    .select()
    .single();

  if (error) {
    console.error('Error tracking event:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, event_id: data.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleInstallEvent(req: Request, supabase: any) {
  const body = await req.json();

  // Get user from auth header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Parse platform from user agent or explicit
  const platform = body.platform || parseUserAgent(req.headers.get('user-agent') || '').os;
  const userAgent = req.headers.get('user-agent') || '';

  // Insert or update install metrics
  const { data, error } = await supabase
    .from('pwa_install_metrics')
    .upsert({
      user_id: user.id,
      platform,
      install_date: new Date().toISOString().split('T')[0],
      first_session_date: new Date().toISOString().split('T')[0],
      sessions_count: 1,
      last_active: new Date().toISOString(),
      metadata: {
        user_agent: userAgent,
        install_source: body.source || 'unknown',
        referral_url: body.referral_url || null
      }
    }, {
      onConflict: 'user_id,platform'
    })
    .select()
    .single();

  // Also log the install event
  await supabase
    .from('pwa_events')
    .insert({
      event_type: 'pwa_installed',
      user_id: user.id,
      platform,
      user_agent: userAgent,
      event_data: body
    });

  if (error) {
    console.error('Error recording install:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      install_id: data.id,
      platform
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handlePushSubscription(req: Request, supabase: any) {
  const subscription: PushSubscriptionData = await req.json();

  // Get user from auth header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Store subscription
  const { data, error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      device_id: subscription.device_id,
      is_active: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,endpoint'
    })
    .select()
    .single();

  // Update install metrics
  await supabase
    .from('pwa_install_metrics')
    .update({
      push_subscribed: true,
      notifications_enabled: true,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id);

  // Log event
  await supabase
    .from('pwa_events')
    .insert({
      event_type: 'push_subscribed',
      user_id: user.id,
      event_data: { endpoint: subscription.endpoint }
    });

  if (error) {
    console.error('Error storing subscription:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, subscription_id: data.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handlePushUnsubscription(req: Request, supabase: any) {
  const { endpoint } = await req.json();

  // Get user from auth header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Mark subscription as inactive
  const { error } = await supabase
    .from('push_subscriptions')
    .update({
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('endpoint', endpoint);

  // Log event
  await supabase
    .from('pwa_events')
    .insert({
      event_type: 'push_unsubscribed',
      user_id: user.id,
      event_data: { endpoint }
    });

  if (error) {
    console.error('Error removing subscription:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetMetrics(req: Request, supabase: any) {
  // Get user from auth header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Get user's install metrics
  const { data: metrics, error: metricsError } = await supabase
    .from('pwa_install_metrics')
    .select('*')
    .eq('user_id', user.id);

  // Get active push subscriptions
  const { data: subscriptions, error: subError } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (metricsError) {
    return new Response(
      JSON.stringify({ error: metricsError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      metrics: metrics || [],
      subscriptions: subscriptions || [],
      total_installs: metrics?.length || 0,
      push_enabled: (subscriptions?.length || 0) > 0
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function parseUserAgent(userAgent: string): any {
  const ua = userAgent.toLowerCase();

  let os = 'unknown';
  let browser = 'unknown';
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua);
  const isTablet = /tablet|ipad|playbook|kindle|silk/i.test(ua);

  if (/iphone|ipad|ipod|mac os/i.test(ua)) {
    os = 'ios';
  } else if (/android/i.test(ua)) {
    os = 'android';
  } else if (/windows/i.test(ua)) {
    os = 'windows';
  } else if (/linux/i.test(ua)) {
    os = 'linux';
  } else if (/mac os|macintosh/i.test(ua)) {
    os = 'macos';
  }

  if (/chrome|crios|cros/i.test(ua)) {
    browser = 'chrome';
  } else if (/safari|applewebkit/i.test(ua)) {
    browser = 'safari';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'firefox';
  } else if (/edge|edg/i.test(ua)) {
    browser = 'edge';
  }

  return { os, browser, is_mobile: isMobile, is_tablet: isTablet };
}