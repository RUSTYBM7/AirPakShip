import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zygoqqsgzhgpvlpttfbk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Z29xcXNnemhncHZscHR0ZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDAwNzQsImV4cCI6MjA5NTI3NjA3NH0.k3SWSNXtvAI-z1sBQxOwIhXWLt34nszv7EC5nktruNw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to check auth state
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Sign in function
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

// Sign out function
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Sign up function
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  if (error) throw error;
  return data;
};

// ========== DATABASE HELPERS ==========

// Get all approvals
export const getApprovals = async () => {
  const { data, error } = await supabase
    .from('approvals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Update approval status
export const updateApprovalStatus = async (id: string, status: 'pending' | 'approved' | 'rejected' | 'modified') => {
  const { data, error } = await supabase
    .from('approvals')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Create approval item (for AI content)
export const createApproval = async (approvalData: {
  type: string;
  title: string;
  description: string;
  requested_by: string;
  priority: string;
  content?: any;
}) => {
  const { data, error } = await supabase
    .from('approvals')
    .insert({
      ...approvalData,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get all shipments (admin view)
export const getAllShipments = async () => {
  const { data, error } = await supabase
    .from('shipments')
    .select('*, profiles(name, email)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Update shipment status
export const updateShipmentStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('shipments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Add tracking event
export const addTrackingEvent = async (eventData: {
  shipment_id: string;
  tracking_number: string;
  status: string;
  location: string;
  lat?: number;
  lng?: number;
}) => {
  const { data, error } = await supabase
    .from('tracking_events')
    .insert(eventData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get escalated tickets
export const getEscalatedTickets = async () => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*, profiles(name, email)')
    .eq('status', 'escalated')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// Assign ticket to admin
export const assignTicket = async (ticketId: string, adminId: string) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({
      assigned_admin: adminId,
      status: 'resolved'
    })
    .eq('id', ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get user messages
export const getTicketMessages = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

// Send admin reply
export const sendAdminReply = async (ticketId: string, content: string, adminId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      ticket_id: ticketId,
      sender_id: adminId,
      sender_type: 'admin',
      content,
      read_by: [adminId],
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Get audit logs
export const getAuditLogs = async (limit: number = 100) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
};

// Log audit event
export const logAuditEvent = async (eventData: {
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  details?: any;
}) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert(eventData)
    .select()
    .single();
  if (error) throw error;
  return data;
};