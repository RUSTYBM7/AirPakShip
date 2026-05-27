// Type definitions for Airpak Express Admin

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'staff';
  created_at: string;
  last_login?: string;
  avatar_url?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  total_shipments: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions?: string;
  service_type: 'express' | 'standard' | 'economy';
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'cancelled';
  current_location?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  shipping_cost: number;
  insurance_cost?: number;
  customs_cost?: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
  history: ShipmentEvent[];
}

export interface ShipmentEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface TrackingUpdate {
  id: string;
  shipment_id: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface Quote {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  origin_country: string;
  origin_city: string;
  destination_country: string;
  destination_city: string;
  weight: number;
  dimensions?: string;
  service_type: 'air' | 'sea' | 'road';
  express_type?: 'express' | 'standard';
  estimated_cost: number;
  valid_until?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'expired';
  created_at: string;
}

export interface AnalyticsData {
  total_shipments: number;
  active_shipments: number;
  delivered_today: number;
  pending_pickups: number;
  revenue_today: number;
  revenue_month: number;
  top_destinations: { country: string; count: number }[];
  monthly_shipments: { month: string; count: number }[];
  status_breakdown: { status: string; count: number }[];
}

export interface Settings {
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  operating_hours: string;
  timezone: string;
  currency: string;
  fuel_surcharge_percent: number;
  insurance_rate_percent: number;
  customs_fee_flat: number;
}