-- ============================================================
-- AIRPAK EXPRESS - USER PORTAL UPGRADE SCHEMA
-- Execute this in: https://supabase.com/dashboard/project/zygoqqsgzhgpvlpttfbk/sql
-- ============================================================

-- Profile enhancements
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'basic';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS license_status TEXT DEFAULT 'none';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Shipments table
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tracking_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.branches(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','picked_up','in_transit','at_hub','out_for_delivery','delivered','returned','cancelled')),
    origin JSONB NOT NULL,
    destination JSONB NOT NULL,
    weight_kg NUMERIC,
    dimensions_cm JSONB,
    declared_value NUMERIC,
    service_type TEXT DEFAULT 'standard',
    estimated_delivery TIMESTAMPTZ,
    current_location JSONB,
    recipient_name TEXT,
    recipient_phone TEXT,
    recipient_email TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shipment Events
CREATE TABLE IF NOT EXISTS public.shipment_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    location JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    priority TEXT DEFAULT 'normal',
    source_portal TEXT,
    target_portal TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Licenses
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    license_type TEXT NOT NULL,
    license_number TEXT NOT NULL,
    issuing_authority TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    document_url TEXT,
    verification_status TEXT DEFAULT 'pending',
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    cert_type TEXT NOT NULL,
    cert_number TEXT NOT NULL,
    issuing_body TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    audit_score NUMERIC,
    last_audit_date DATE,
    next_audit_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Portal Signals (Bidirectional)
CREATE TABLE IF NOT EXISTS public.portal_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    signal_type TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    correlation_id TEXT,
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User Sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    device_type TEXT,
    device_name TEXT,
    device_id TEXT,
    push_token TEXT,
    is_active BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Shipments: owners + admins
CREATE POLICY "shipments_select" ON public.shipments FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "shipments_insert" ON public.shipments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "shipments_update" ON public.shipments FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "shipments_delete" ON public.shipments FOR DELETE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Shipment Events: via shipment access
CREATE POLICY "events_select" ON public.shipment_events FOR SELECT USING (EXISTS (SELECT 1 FROM public.shipments WHERE id = shipment_id AND user_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "events_insert" ON public.shipment_events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.shipments WHERE id = shipment_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')))));

-- Notifications: owners + admins
CREATE POLICY "notifs_select" ON public.notifications FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "notifs_update" ON public.notifications FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Licenses: owners only
CREATE POLICY "licenses_select" ON public.licenses FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "licenses_insert" ON public.licenses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "licenses_update" ON public.licenses FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Certifications: owners only
CREATE POLICY "certs_select" ON public.certifications FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "certs_insert" ON public.certifications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "certs_update" ON public.certifications FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Portal Signals: admin only
CREATE POLICY "signals_all" ON public.portal_signals FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- User Sessions: owners only
CREATE POLICY "sessions_owner" ON public.user_sessions FOR ALL USING (user_id = auth.uid());

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_shipment_created ON public.shipments;
CREATE TRIGGER trg_shipment_created AFTER INSERT ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.signal_shipment_created();

CREATE OR REPLACE FUNCTION public.signal_shipment_updated()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.portal_signals (signal_type, source, target, payload)
        VALUES ('data_update', 'supabase', 'both', jsonb_build_object('shipment_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_shipment_updated ON public.shipments;
CREATE TRIGGER trg_shipment_updated AFTER UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.signal_shipment_updated();

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