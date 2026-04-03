// ==========================================
// Data Service Layer
// All data access goes through here.
// Swap mock-data imports with real DB calls later.
// ==========================================

import {
  Lead, Client, Project, Activity, Notification,
  DashboardStats, CreateLeadInput, UpdateLeadInput,
  CreateClientInput, CreateProjectInput,
  LeadStatus, ProjectStatus,
} from '@/types';
import {
  mockLeads, mockClients, mockProjects, mockActivities, mockNotifications,
} from './mock-data';

// In-memory stores (will be replaced with DB)
let leads = [...mockLeads];
let clients = [...mockClients];
let projects = [...mockProjects];
let activities = [...mockActivities];
let notifications = [...mockNotifications];

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================
// LEADS
// ==========================================
export function getLeads(filters?: {
  status?: LeadStatus;
  source?: string;
  search?: string;
  unread?: boolean;
}): Lead[] {
  let result = [...leads];
  if (filters?.status) result = result.filter(l => l.status === filters.status);
  if (filters?.source) result = result.filter(l => l.source === filters.source);
  if (filters?.unread !== undefined) result = result.filter(l => l.unread === filters.unread);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(l =>
      l.fullName.toLowerCase().includes(q) ||
      l.companyName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
    );
  }
  return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getLeadById(id: string): Lead | undefined {
  return leads.find(l => l.id === id);
}

export function createLead(input: CreateLeadInput): Lead {
  const now = new Date().toISOString();
  const lead: Lead = {
    id: generateId('lead'),
    fullName: input.fullName,
    companyName: input.companyName || '',
    email: input.email,
    phone: input.phone || '',
    source: input.source || 'Manual',
    status: 'new',
    firstContactDate: now,
    lastContactDate: now,
    estimatedBudget: input.estimatedBudget ?? null,
    serviceRequested: input.serviceRequested || '',
    notes: input.notes || '',
    inquiryMessage: input.inquiryMessage || '',
    submittedAt: now,
    unread: true,
    tags: [],
  };
  leads.unshift(lead);

  // Create activity
  createActivity({
    type: 'lead_created',
    entityType: 'lead',
    entityId: lead.id,
    entityName: lead.fullName,
    description: `New lead from ${lead.source}`,
  });

  // Create notification
  const notif: Notification = {
    id: generateId('notif'),
    type: 'new_lead',
    title: 'New Lead',
    message: `${lead.fullName} submitted a contact from ${lead.source}`,
    read: false,
    entityType: 'lead',
    entityId: lead.id,
    createdAt: now,
  };
  notifications.unshift(notif);

  return lead;
}

export function updateLead(id: string, input: UpdateLeadInput): Lead | undefined {
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return undefined;
  const oldStatus = leads[idx].status;
  leads[idx] = { ...leads[idx], ...input, lastContactDate: new Date().toISOString() };

  if (input.status && input.status !== oldStatus) {
    createActivity({
      type: 'lead_status_changed',
      entityType: 'lead',
      entityId: id,
      entityName: leads[idx].fullName,
      description: `Status changed from ${oldStatus} to ${input.status}`,
    });
  }
  return leads[idx];
}

export function deleteLead(id: string): boolean {
  const len = leads.length;
  leads = leads.filter(l => l.id !== id);
  return leads.length < len;
}

export function convertLeadToClient(leadId: string): Client | undefined {
  const lead = getLeadById(leadId);
  if (!lead) return undefined;

  // Update lead status
  updateLead(leadId, { status: 'won', unread: false });

  // Create client
  const client: Client = {
    id: generateId('client'),
    fullName: lead.fullName,
    company: lead.companyName,
    email: lead.email,
    phone: lead.phone,
    country: '',
    city: '',
    preferredContact: 'email',
    status: 'active',
    totalSpent: 0,
    projectCount: 0,
    registrationDate: new Date().toISOString(),
    notes: lead.notes,
    tags: lead.tags,
    convertedFromLeadId: leadId,
  };
  clients.unshift(client);

  createActivity({
    type: 'lead_converted',
    entityType: 'lead',
    entityId: leadId,
    entityName: lead.fullName,
    description: 'Lead converted to client',
  });

  createActivity({
    type: 'client_created',
    entityType: 'client',
    entityId: client.id,
    entityName: client.fullName,
    description: 'New client created from lead conversion',
  });

  return client;
}

export function getUnreadLeadCount(): number {
  return leads.filter(l => l.unread).length;
}

// ==========================================
// CLIENTS
// ==========================================
export function getClients(filters?: {
  status?: string;
  search?: string;
}): Client[] {
  let result = [...clients];
  if (filters?.status) result = result.filter(c => c.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(c =>
      c.fullName.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }
  return result.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
}

export function getClientById(id: string): Client | undefined {
  return clients.find(c => c.id === id);
}

export function createClient(input: CreateClientInput): Client {
  const client: Client = {
    id: generateId('client'),
    fullName: input.fullName,
    company: input.company || '',
    email: input.email,
    phone: input.phone || '',
    country: input.country || '',
    city: input.city || '',
    preferredContact: input.preferredContact || 'email',
    status: 'active',
    totalSpent: 0,
    projectCount: 0,
    registrationDate: new Date().toISOString(),
    notes: input.notes || '',
    tags: input.tags || [],
  };
  clients.unshift(client);

  createActivity({
    type: 'client_created',
    entityType: 'client',
    entityId: client.id,
    entityName: client.fullName,
    description: 'New client added',
  });

  return client;
}

export function updateClient(id: string, input: Partial<Client>): Client | undefined {
  const idx = clients.findIndex(c => c.id === id);
  if (idx === -1) return undefined;
  clients[idx] = { ...clients[idx], ...input };
  return clients[idx];
}

export function deleteClient(id: string): boolean {
  const len = clients.length;
  clients = clients.filter(c => c.id !== id);
  return clients.length < len;
}

// ==========================================
// PROJECTS
// ==========================================
export function getProjects(filters?: {
  status?: ProjectStatus;
  clientId?: string;
  search?: string;
}): Project[] {
  let result = [...projects];
  if (filters?.status) result = result.filter(p => p.status === filters.status);
  if (filters?.clientId) result = result.filter(p => p.clientId === filters.clientId);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q)
    );
  }
  return result.sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getProjectsByClientId(clientId: string): Project[] {
  return projects.filter(p => p.clientId === clientId);
}

export function createProject(input: CreateProjectInput): Project {
  const client = getClientById(input.clientId);
  const project: Project = {
    id: generateId('proj'),
    title: input.title,
    clientId: input.clientId,
    clientName: client?.fullName || 'Unknown',
    serviceType: input.serviceType,
    description: input.description || '',
    status: 'planning',
    priority: input.priority || 'medium',
    startDate: input.startDate || '',
    deadline: input.deadline || '',
    deliveryDate: null,
    price: input.price || 0,
    amountPaid: 0,
    remainingAmount: input.price || 0,
    paymentStatus: 'unpaid',
    assignedTo: input.assignedTo || 'Bobur A.',
    progress: 0,
    requirements: input.requirements || '',
    notes: input.notes || '',
  };
  projects.unshift(project);

  if (client) {
    updateClient(client.id, { projectCount: client.projectCount + 1 });
  }

  createActivity({
    type: 'project_created',
    entityType: 'project',
    entityId: project.id,
    entityName: project.title,
    description: `New project created: ${project.title} ($${project.price.toLocaleString()})`,
  });

  return project;
}

export function updateProject(id: string, input: Partial<Project>): Project | undefined {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  const oldStatus = projects[idx].status;
  projects[idx] = { ...projects[idx], ...input };

  // Recalculate remaining
  if (input.amountPaid !== undefined || input.price !== undefined) {
    const p = projects[idx];
    p.remainingAmount = p.price - p.amountPaid;
    if (p.remainingAmount <= 0) p.paymentStatus = 'paid';
    else if (p.amountPaid > 0) p.paymentStatus = 'partial';
  }

  if (input.status && input.status !== oldStatus) {
    createActivity({
      type: input.status === 'completed' ? 'project_completed' : 'project_status_changed',
      entityType: 'project',
      entityId: id,
      entityName: projects[idx].title,
      description: input.status === 'completed'
        ? 'Project completed and delivered'
        : `Status changed from ${oldStatus} to ${input.status}`,
    });
  }

  return projects[idx];
}

export function deleteProject(id: string): boolean {
  const len = projects.length;
  projects = projects.filter(p => p.id !== id);
  return projects.length < len;
}

// ==========================================
// ACTIVITIES
// ==========================================
export function getActivities(filters?: {
  entityType?: string;
  entityId?: string;
  limit?: number;
}): Activity[] {
  let result = [...activities];
  if (filters?.entityType) result = result.filter(a => a.entityType === filters.entityType);
  if (filters?.entityId) result = result.filter(a => a.entityId === filters.entityId);
  result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (filters?.limit) result = result.slice(0, filters.limit);
  return result;
}

export function createActivity(input: Omit<Activity, 'id' | 'createdAt'>): Activity {
  const activity: Activity = {
    ...input,
    id: generateId('act'),
    createdAt: new Date().toISOString(),
  };
  activities.unshift(activity);
  return activity;
}

// ==========================================
// NOTIFICATIONS
// ==========================================
export function getNotifications(): Notification[] {
  return [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadNotificationCount(): number {
  return notifications.filter(n => !n.read).length;
}

export function markNotificationRead(id: string): void {
  const notif = notifications.find(n => n.id === id);
  if (notif) notif.read = true;
}

export function markAllNotificationsRead(): void {
  notifications.forEach(n => { n.read = true; });
}

// ==========================================
// DASHBOARD
// ==========================================
export function getDashboardStats(): DashboardStats {
  const leadsByStatus = {} as Record<LeadStatus, number>;
  const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  statuses.forEach(s => { leadsByStatus[s] = leads.filter(l => l.status === s).length; });

  const projectsByStatus = {} as Record<ProjectStatus, number>;
  const pStatuses: ProjectStatus[] = ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];
  pStatuses.forEach(s => { projectsByStatus[s] = projects.filter(p => p.status === s).length; });

  const totalRevenue = projects.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalUnpaid = projects.reduce((sum, p) => sum + p.remainingAmount, 0);

  const now = new Date();
  const leadsThisMonth = leads.filter(l => {
    const d = new Date(l.submittedAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Revenue by month (last 7 months)
  const revenueByMonth: { month: string; revenue: number }[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const rev = projects
      .filter(p => p.amountPaid > 0 && p.startDate)
      .filter(p => {
        const pd = new Date(p.startDate);
        return pd.getMonth() === m && pd.getFullYear() === y;
      })
      .reduce((sum, p) => sum + p.amountPaid, 0);
    revenueByMonth.push({ month: months[m], revenue: rev });
  }

  return {
    totalLeads: leads.length,
    totalClients: clients.filter(c => c.status === 'active').length,
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    inProgressProjects: projects.filter(p => p.status === 'in_progress').length,
    totalRevenue,
    totalUnpaid,
    leadsThisMonth,
    leadsByStatus,
    projectsByStatus,
    revenueByMonth,
  };
}
