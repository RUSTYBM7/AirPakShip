/**
 * AirPak Admin - Supabase API
 * All database operations for the admin panel
 */

import { supabase } from './supabase';

// Types
interface Profile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  avatar?: string;
  role: 'user' | 'admin';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  region?: string;
  country_code?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
}

interface Shipment {
  id: string;
  user_id: string;
  tracking_number: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'customs' | 'out_for_delivery' | 'delivered' | 'exception' | 'returned';
  origin: any;
  destination: any;
  current_location?: any;
  weight: number;
  service: 'express' | 'standard' | 'economy';
  estimated_delivery: string;
  created_at: string;
  updated_at: string;
}

interface TrackingEvent {
  id: string;
  shipment_id: string;
  tracking_number: string;
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
  lat?: number;
  lng?: number;
}

interface SupportTicket {
  id: string;
  user_id: string;
  title: string;
  status: 'ai_handling' | 'escalated' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  ai_session_id?: string;
  ai_handled: boolean;
  escalation_reason?: string;
  assigned_admin?: string;
  created_at: string;
  updated_at: string;
}

// ==================== ADMIN PROFILES ====================

export const getUsers = async (filters?: { role?: string; tier?: string; search?: string }) => {
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }
  if (filters?.tier) {
    query = query.eq('tier', filters.tier);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getUser = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateUser = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  if (error) throw error;
};

// ==================== ADMIN SHIPMENTS ====================

export const getAllShipments = async (filters?: {
  status?: string;
  service?: string;
  search?: string;
  userId?: string;
}) => {
  let query = supabase
    .from('shipments')
    .select('*, profiles:name,email')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.service) {
    query = query.eq('service', filters.service);
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.search) {
    query = query.or(`tracking_number.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getShipment = async (shipmentId: string): Promise<Shipment> => {
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('id', shipmentId)
    .single();
  if (error) throw error;
  return data;
};

export const updateShipment = async (shipmentId: string, updates: Partial<Shipment>) => {
  const { data, error } = await supabase
    .from('shipments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', shipmentId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateShipmentStatus = async (
  shipmentId: string,
  status: Shipment['status'],
  location?: string
) => {
  return updateShipment(shipmentId, { status, current_location: location || undefined });
};

// ==================== ADMIN TRACKING ====================

export const addTrackingEvent = async (
  shipmentId: string,
  trackingNumber: string,
  event: {
    status: string;
    location: string;
    completed?: boolean;
    lat?: number;
    lng?: number;
  }
) => {
  const { data, error } = await supabase
    .from('tracking_events')
    .insert({
      shipment_id: shipmentId,
      tracking_number: trackingNumber,
      status: event.status,
      location: event.location,
      timestamp: new Date().toISOString(),
      completed: event.completed ?? false,
      lat: event.lat,
      lng: event.lng
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getTrackingEvents = async (trackingNumber: string): Promise<TrackingEvent[]> => {
  const { data, error } = await supabase
    .from('tracking_events')
    .select('*')
    .eq('tracking_number', trackingNumber)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data || [];
};

// ==================== ADMIN SUPPORT ====================

export const getAllSupportTickets = async (filters?: {
  status?: string;
  priority?: string;
  assignedTo?: string;
}) => {
  let query = supabase
    .from('support_tickets')
    .select('*, profiles:name,email')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.assignedTo) {
    query = query.eq('assigned_admin', filters.assignedTo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const assignTicket = async (ticketId: string, adminId: string) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({ assigned_admin: adminId, updated_at: new Date().toISOString() })
    .eq('id', ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTicketStatus = async (
  ticketId: string,
  status: SupportTicket['status']
) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ==================== APPROVALS ====================

export interface ApprovalItem {
  id: string;
  type: 'document' | 'invoice' | 'email' | 'workflow' | 'graphic' | 'pricing';
  title: string;
  description: string;
  requested_by: string;
  requested_at: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  content?: any;
  metadata?: any;
}

export const getApprovals = async (filters?: {
  status?: string;
  type?: string;
  priority?: string;
}): Promise<ApprovalItem[]> => {
  let query = supabase
    .from('approvals')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createApproval = async (approval: Omit<ApprovalItem, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('approvals')
    .insert(approval)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const approveItem = async (approvalId: string) => {
  const { data, error } = await supabase
    .from('approvals')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', approvalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const rejectItem = async (approvalId: string, reason?: string) => {
  const { data, error } = await supabase
    .from('approvals')
    .update({ status: 'rejected', metadata: { rejection_reason: reason }, updated_at: new Date().toISOString() })
    .eq('id', approvalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const modifyItem = async (approvalId: string, modifications: any) => {
  const { data, error } = await supabase
    .from('approvals')
    .update({ status: 'modified', content: modifications, updated_at: new Date().toISOString() })
    .eq('id', approvalId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ==================== AUDIT LOGS ====================

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
  profiles?: { name: string; email: string };
}

export const getAuditLogs = async (filters?: {
  userId?: string;
  action?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
}): Promise<AuditLog[]> => {
  let query = supabase
    .from('audit_logs')
    .select('*, profiles:name,email')
    .order('created_at', { ascending: false })
    .limit(100);

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.action) {
    query = query.eq('action', filters.action);
  }
  if (filters?.resourceType) {
    query = query.eq('resource_type', filters.resourceType);
  }
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createAuditLog = async (log: Omit<AuditLog, 'id' | 'created_at' | 'profiles'>) => {
  const { error } = await supabase
    .from('audit_logs')
    .insert(log);
  if (error) throw error;
};

// ==================== ANALYTICS ====================

export const getAdminStats = async () => {
  const [users, shipments, tickets] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('shipments').select('*', { count: 'exact', head: true }),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true })
  ]);

  const statusCounts = await supabase
    .from('shipments')
    .select('status');

  const statusDistribution: Record<string, number> = {};
  statusCounts.data?.forEach((s: any) => {
    statusDistribution[s.status] = (statusDistribution[s.status] || 0) + 1;
  });

  return {
    totalUsers: users.count || 0,
    totalShipments: shipments.count || 0,
    totalTickets: tickets.count || 0,
    statusDistribution
  };
};

// ==================== REAL-TIME ====================

export const subscribeToApprovals = (
  onNewApproval: (approval: ApprovalItem) => void
) => {
  return supabase
    .channel('approvals-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'approvals'
      },
      (payload) => {
        onNewApproval(payload.new as ApprovalItem);
      }
    )
    .subscribe();
};

export const subscribeToNewTickets = (
  onNewTicket: (ticket: SupportTicket) => void
) => {
  return supabase
    .channel('tickets-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'support_tickets'
      },
      (payload) => {
        onNewTicket(payload.new as SupportTicket);
      }
    )
    .subscribe();
};

export default supabase;
