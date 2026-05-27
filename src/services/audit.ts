// Audit logging service for AI actions and admin operations
import { supabase } from '../lib/supabase';

export type AuditAction =
  // Authentication
  | 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET' | 'LOGIN_FAILED'
  // Shipments
  | 'SHIPMENT_CREATED' | 'SHIPMENT_UPDATED' | 'SHIPMENT_DELETED' | 'SHIPMENT_STATUS_CHANGED'
  // AI Document
  | 'AI_DOCUMENT_GENERATED' | 'AI_DOCUMENT_DOWNLOADED' | 'AI_DOCUMENT_SENT'
  // AI Invoice
  | 'AI_INVOICE_GENERATED' | 'AI_INVOICE_SENT' | 'AI_INVOICE_PAID'
  // AI Creative
  | 'AI_CREATIVE_GENERATED' | 'AI_CREATIVE_DOWNLOADED'
  // AI Workflows
  | 'AI_WORKFLOW_CREATED' | 'AI_WORKFLOW_UPDATED' | 'AI_WORKFLOW_DELETED' | 'AI_WORKFLOW_EXECUTED'
  // Email
  | 'EMAIL_CAMPAIGN_CREATED' | 'EMAIL_CAMPAIGN_SENT' | 'EMAIL_TEMPLATE_CREATED'
  // Autopilot
  | 'AUTOPILOT_ENABLED' | 'AUTOPILOT_DISABLED' | 'AUTOPILOT_CONFIG_UPDATED'
  // Document Parser
  | 'DOCUMENT_PARSED' | 'DOCUMENT_IMPORTED'
  // Users & RBAC
  | 'USER_CREATED' | 'USER_UPDATED' | 'USER_ROLE_CHANGED' | 'PERMISSION_CHANGED'
  // Settings
  | 'SETTINGS_UPDATED' | 'BRANCH_CREATED' | 'BRANCH_UPDATED';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  user_email: string;
  action: AuditAction;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  ai_tokens_used?: number;
  ai_cost_usd?: number;
  created_at: string;
}

export interface AuditFilters {
  action?: AuditAction;
  resource_type?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

// Create audit log entry
export const createAuditLog = async (
  entry: Omit<AuditLogEntry, 'id' | 'created_at'>,
  supabaseClient = supabase
): Promise<{ data: AuditLogEntry | null; error: Error | null }> => {
  try {
    const { data, error } = await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: entry.user_id,
        user_email: entry.user_email,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        details: entry.details,
        ip_address: entry.ip_address,
        user_agent: entry.user_agent,
        ai_tokens_used: entry.ai_tokens_used,
        ai_cost_usd: entry.ai_cost_usd,
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as AuditLogEntry, error: null };
  } catch (error) {
    console.error('Audit log creation failed:', error);
    return { data: null, error: error as Error };
  }
};

// Query audit logs
export const getAuditLogs = async (
  filters: AuditFilters,
  supabaseClient = supabase
): Promise<{ data: AuditLogEntry[]; error: Error | null }> => {
  try {
    let query = supabaseClient
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(filters.limit || 100);

    if (filters.action) {
      query = query.eq('action', filters.action);
    }
    if (filters.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.start_date) {
      query = query.gte('created_at', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('created_at', filters.end_date);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as AuditLogEntry[], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
};

// Get AI action costs
export const getAICostSummary = async (
  startDate: string,
  endDate: string,
  supabaseClient = supabase
): Promise<{ total_tokens: number; total_cost: number; action_breakdown: Record<string, { count: number; cost: number }> }> => {
  try {
    const { data, error } = await supabaseClient
      .from('audit_logs')
      .select('action, ai_tokens_used, ai_cost_usd')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .not('ai_cost_usd', 'is', null);

    if (error) throw error;

    const summary = {
      total_tokens: 0,
      total_cost: 0,
      action_breakdown: {} as Record<string, { count: number; cost: number }>,
    };

    data.forEach((log: any) => {
      summary.total_tokens += log.ai_tokens_used || 0;
      summary.total_cost += log.ai_cost_usd || 0;

      const action = log.action;
      if (!summary.action_breakdown[action]) {
        summary.action_breakdown[action] = { count: 0, cost: 0 };
      }
      summary.action_breakdown[action].count++;
      summary.action_breakdown[action].cost += log.ai_cost_usd || 0;
    });

    return summary;
  } catch (error) {
    console.error('Failed to get AI cost summary:', error);
    return { total_tokens: 0, total_cost: 0, action_breakdown: {} };
  }
};

// Audit log component for UI display
export const formatAuditAction = (action: AuditAction): string => {
  const labels: Record<AuditAction, string> = {
    LOGIN: 'User Login',
    LOGOUT: 'User Logout',
    PASSWORD_RESET: 'Password Reset',
    LOGIN_FAILED: 'Failed Login Attempt',
    SHIPMENT_CREATED: 'Shipment Created',
    SHIPMENT_UPDATED: 'Shipment Updated',
    SHIPMENT_DELETED: 'Shipment Deleted',
    SHIPMENT_STATUS_CHANGED: 'Shipment Status Changed',
    AI_DOCUMENT_GENERATED: 'AI Document Generated',
    AI_DOCUMENT_DOWNLOADED: 'AI Document Downloaded',
    AI_DOCUMENT_SENT: 'AI Document Sent',
    AI_INVOICE_GENERATED: 'AI Invoice Generated',
    AI_INVOICE_SENT: 'AI Invoice Sent',
    AI_INVOICE_PAID: 'Invoice Payment Confirmed',
    AI_CREATIVE_GENERATED: 'AI Creative Generated',
    AI_CREATIVE_DOWNLOADED: 'AI Creative Downloaded',
    AI_WORKFLOW_CREATED: 'AI Workflow Created',
    AI_WORKFLOW_UPDATED: 'AI Workflow Updated',
    AI_WORKFLOW_DELETED: 'AI Workflow Deleted',
    AI_WORKFLOW_EXECUTED: 'AI Workflow Executed',
    EMAIL_CAMPAIGN_CREATED: 'Email Campaign Created',
    EMAIL_CAMPAIGN_SENT: 'Email Campaign Sent',
    EMAIL_TEMPLATE_CREATED: 'Email Template Created',
    AUTOPILOT_ENABLED: 'Autopilot Enabled',
    AUTOPILOT_DISABLED: 'Autopilot Disabled',
    AUTOPILOT_CONFIG_UPDATED: 'Autopilot Config Updated',
    DOCUMENT_PARSED: 'Document Parsed',
    DOCUMENT_IMPORTED: 'Document Imported',
    USER_CREATED: 'User Created',
    USER_UPDATED: 'User Updated',
    USER_ROLE_CHANGED: 'User Role Changed',
    PERMISSION_CHANGED: 'Permission Changed',
    SETTINGS_UPDATED: 'Settings Updated',
    BRANCH_CREATED: 'Branch Created',
    BRANCH_UPDATED: 'Branch Updated',
  };
  return labels[action] || action;
};

export const isAIAction = (action: AuditAction): boolean => {
  return action.startsWith('AI_');
};