// ==========================================
// CRM Type Definitions
// ==========================================

// Enums
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type ClientStatus = 'active' | 'inactive' | 'churned';
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue' | 'refunded';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ActivityType =
  | 'lead_created'
  | 'lead_contacted'
  | 'lead_converted'
  | 'lead_status_changed'
  | 'client_created'
  | 'project_created'
  | 'project_status_changed'
  | 'project_completed'
  | 'payment_received'
  | 'note_added'
  | 'email_sent'
  | 'call_made'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'form_submission'
  | 'whatsapp_contact'
  | 'telegram_contact';

// Lead
export interface Lead {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  firstContactDate: string;
  lastContactDate: string;
  estimatedBudget: number | null;
  serviceRequested: string;
  notes: string;
  inquiryMessage: string;
  submittedAt: string;
  unread: boolean;
  tags: string[];
}

// Client
export interface Client {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  preferredContact: 'email' | 'phone' | 'whatsapp' | 'telegram';
  status: ClientStatus;
  totalSpent: number;
  projectCount: number;
  registrationDate: string;
  notes: string;
  tags: string[];
  convertedFromLeadId?: string;
}

// Project
export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  deadline: string;
  deliveryDate: string | null;
  price: number;
  amountPaid: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  assignedTo: string;
  progress: number;
  requirements: string;
  notes: string;
}

// Activity
export interface Activity {
  id: string;
  type: ActivityType;
  entityType: 'lead' | 'client' | 'project';
  entityId: string;
  entityName: string;
  description: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  type: 'new_lead' | 'payment' | 'deadline' | 'status_change' | 'general';
  title: string;
  message: string;
  read: boolean;
  entityType?: 'lead' | 'client' | 'project';
  entityId?: string;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalLeads: number;
  totalClients: number;
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  totalRevenue: number;
  totalUnpaid: number;
  leadsThisMonth: number;
  leadsByStatus: Record<LeadStatus, number>;
  projectsByStatus: Record<ProjectStatus, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

// API Types
export interface CreateLeadInput {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  source?: string;
  serviceRequested?: string;
  estimatedBudget?: number | null;
  inquiryMessage?: string;
  notes?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {
  status?: LeadStatus;
  unread?: boolean;
  tags?: string[];
}

export interface CreateClientInput {
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp' | 'telegram';
  notes?: string;
  tags?: string[];
}

export interface CreateProjectInput {
  title: string;
  clientId: string;
  serviceType: string;
  description?: string;
  priority?: Priority;
  startDate?: string;
  deadline?: string;
  price?: number;
  assignedTo?: string;
  requirements?: string;
  notes?: string;
}
