import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LeadStatus, ClientStatus, ProjectStatus, PaymentStatus, Priority } from "@/types";

const leadStatusConfig: Record<LeadStatus, { label: string; variant: string }> = {
  new: { label: "New", variant: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  contacted: { label: "Contacted", variant: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  qualified: { label: "Qualified", variant: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  proposal: { label: "Proposal", variant: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  negotiation: { label: "Negotiation", variant: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  won: { label: "Won", variant: "bg-green-500/10 text-green-500 border-green-500/20" },
  lost: { label: "Lost", variant: "bg-red-500/10 text-red-500 border-red-500/20" },
};

const clientStatusConfig: Record<ClientStatus, { label: string; variant: string }> = {
  active: { label: "Active", variant: "bg-green-500/10 text-green-500 border-green-500/20" },
  inactive: { label: "Inactive", variant: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  churned: { label: "Churned", variant: "bg-red-500/10 text-red-500 border-red-500/20" },
};

const projectStatusConfig: Record<ProjectStatus, { label: string; variant: string }> = {
  planning: { label: "Planning", variant: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  in_progress: { label: "In Progress", variant: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  review: { label: "Review", variant: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  completed: { label: "Completed", variant: "bg-green-500/10 text-green-500 border-green-500/20" },
  on_hold: { label: "On Hold", variant: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  cancelled: { label: "Cancelled", variant: "bg-red-500/10 text-red-500 border-red-500/20" },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; variant: string }> = {
  unpaid: { label: "Unpaid", variant: "bg-red-500/10 text-red-500 border-red-500/20" },
  partial: { label: "Partial", variant: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  paid: { label: "Paid", variant: "bg-green-500/10 text-green-500 border-green-500/20" },
  overdue: { label: "Overdue", variant: "bg-red-500/10 text-red-500 border-red-500/20" },
  refunded: { label: "Refunded", variant: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
};

const priorityConfig: Record<Priority, { label: string; variant: string }> = {
  low: { label: "Low", variant: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  medium: { label: "Medium", variant: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  high: { label: "High", variant: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  urgent: { label: "Urgent", variant: "bg-red-500/10 text-red-500 border-red-500/20" },
};

type StatusType = LeadStatus | ClientStatus | ProjectStatus | PaymentStatus | Priority;

interface StatusBadgeProps {
  status: StatusType;
  type: "lead" | "client" | "project" | "payment" | "priority";
  className?: string;
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  let config: { label: string; variant: string } | undefined;

  switch (type) {
    case "lead": config = leadStatusConfig[status as LeadStatus]; break;
    case "client": config = clientStatusConfig[status as ClientStatus]; break;
    case "project": config = projectStatusConfig[status as ProjectStatus]; break;
    case "payment": config = paymentStatusConfig[status as PaymentStatus]; break;
    case "priority": config = priorityConfig[status as Priority]; break;
  }

  if (!config) return null;

  return (
    <Badge variant="outline" className={cn("font-medium", config.variant, className)}>
      {config.label}
    </Badge>
  );
}
