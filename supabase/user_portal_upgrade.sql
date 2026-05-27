-- ============================================================
-- USER PORTAL UPGRADE TABLES
-- ============================================================

-- Enhanced User Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_documents JSONB DEFAULT '[]';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"notifications":true,"dark_mode":true,"language":"en"}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login_count INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'basic';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS license_status TEXT DEFAULT 'none';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS license_expires_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logistics_certifications JSONB DEFAULT '[]';

-- User Sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    device_type TEXT,
    device_name TEXT, device_id TEXT, push_token TEXT, ip_address INET, user_agent TEXT,
    is_active BOOLEAN DEFAULT true, last_seen_at TIMESTAMPTZ DEFAULT now(), created_at TIMESTAMPTZ DEFAULT now()
);

-- Shipments
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tracking_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.branches(id),
    status TEXT DEFAULT 'pending',
    origin JSONB NOT NULL, destination JSONB NOT NULL,
    weight_kg NUMERIC, dimensions_cm JSONB, declared_value NUMERIC, insurance_value NUMERIC DEFAULT 0,
    service_type TEXT DEFAULT 'standard',
    estimated_delivery TIMESTAMPTZ, actual_delivery TIMESTAMPTZ, current_location JSONB,
    route_history JSONB DEFAULT '[]', recipient_name TEXT, recipient_phone TEXT, recipient_email TEXT,
    signature_url TEXT, proof_of_delivery JSONB, customs_declaration JSONB, metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shipment Events
CREATE TABLE IF NOT EXISTS public.shipment_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    location JSONB, description TEXT, triggered_by TEXT, metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    admin_id UUID REFERENCES public.profiles(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL, body TEXT NOT NULL, data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false, read_at TIMESTAMPTZ,
    priority TEXT DEFAULT 'normal',
    source_portal TEXT,
    target_portal TEXT,
    delivery_method TEXT[] DEFAULT ARRAY['push','in_app'], created_at TIMESTAMPTZ DEFAULT now()
);

-- Licenses
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    license_type TEXT NOT NULL,
    license_number TEXT NOT NULL, issuing_authority TEXT NOT NULL,
    issue_date DATE NOT NULL, expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    document_url TEXT, verification_status TEXT DEFAULT 'pending',
    verified_by UUID REFERENCES public.profiles(id), verified_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    cert_type TEXT NOT NULL,
    cert_number TEXT NOT NULL, issuing_body TEXT NOT NULL,
    issue_date DATE NOT NULL, expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    document_url TEXT, audit_score NUMERIC, last_audit_date DATE, next_audit_date DATE,
    metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- Portal Signals (Bidirectional)
CREATE TABLE IF NOT EXISTS public.portal_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    signal_type TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    retry_count INT DEFAULT 0, max_retries INT DEFAULT 3, processed_at TIMESTAMPTZ, error_message TEXT,
    correlation_id TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

-- PWA Installs
CREATE TABLE IF NOT EXISTS public.pwa_installs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    platform TEXT NOT NULL,
    device_model TEXT, os_version TEXT, app_version TEXT,
    install_source TEXT,
    manifest_url TEXT, service_worker_status TEXT DEFAULT 'active',
    push_subscription JSONB, last_sync_at TIMESTAMPTZ DEFAULT now(), created_at TIMESTAMPTZ DEFAULT now()
);

-- iOS Configs
CREATE TABLE IF NOT EXISTS public.ios_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    bundle_id TEXT DEFAULT 'com.airpakexpress.user',
    team_id TEXT, apns_token TEXT, device_token TEXT, app_groups TEXT[],
    associated_domains TEXT[] DEFAULT ARRAY['applinks:airpakexpress.com'],
    universal_links_enabled BOOLEAN DEFAULT true,
    siri_shortcuts JSONB DEFAULT '[]', widgets_config JSONB DEFAULT '{}',
    background_refresh_enabled BOOLEAN DEFAULT true,
    location_permissions TEXT DEFAULT 'when_in_use',
    camera_permissions BOOLEAN DEFAULT false,
    photo_permissions BOOLEAN DEFAULT false,
    notification_permissions BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.signal_shipment_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.portal_signals (signal_type, source, target, payload, correlation_id)
    VALUES ('user_action', 'user_portal', 'admin_portal', jsonb_build_object('event', 'shipment_created', 'shipment_id', NEW.id), gen_random_uuid()::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.signal_shipment_updated()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.portal_signals (signal_type, source, target, payload)
        VALUES ('data_update', 'supabase', 'both', jsonb_build_object('shipment_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.signal_ticket_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.portal_signals (signal_type, source, target, payload)
    VALUES ('user_action', 'user_portal', 'admin_portal', jsonb_build_object('ticket_id', NEW.id, 'title', NEW.title));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_shipment_created ON public.shipments;
CREATE TRIGGER trg_shipment_created AFTER INSERT ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.signal_shipment_created();

DROP TRIGGER IF EXISTS trg_shipment_updated ON public.shipments;
CREATE TRIGGER trg_shipment_updated AFTER UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.signal_shipment_updated();

DROP TRIGGER IF EXISTS trg_ticket_signal ON public.support_tickets;
CREATE TRIGGER trg_ticket_signal AFTER INSERT ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.signal_ticket_created();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pwa_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ios_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_sessions_owner ON public.user_sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY shipments_owner ON public.shipments FOR ALL USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));
CREATE POLICY shipment_events_owner ON public.shipment_events FOR ALL USING (EXISTS (SELECT 1 FROM public.shipments WHERE id = shipment_id AND user_id = auth.uid()));
CREATE POLICY notifications_owner ON public.notifications FOR ALL USING (user_id = auth.uid() OR admin_id = auth.uid());
CREATE POLICY licenses_owner ON public.licenses FOR ALL USING (user_id = auth.uid());
CREATE POLICY certifications_owner ON public.certifications FOR ALL USING (user_id = auth.uid());
CREATE POLICY signals_admin ON public.portal_signals FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','super_admin')));
CREATE POLICY pwa_owner ON public.pwa_installs FOR ALL USING (user_id = auth.uid());
CREATE POLICY ios_owner ON public.ios_configs FOR ALL USING (user_id = auth.uid());

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_shipments_user_status ON public.shipments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment ON public.shipment_events(shipment_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_portal_signals_status ON public.portal_signals(status, created_at);
CREATE INDEX IF NOT EXISTS idx_licenses_user_status ON public.licenses(user_id, status);
CREATE INDEX IF NOT EXISTS idx_licenses_expiry ON public.licenses(expiry_date);
CREATE INDEX IF NOT EXISTS idx_certifications_user ON public.certifications(user_id, status);

-- ============================================================
-- REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portal_signals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;