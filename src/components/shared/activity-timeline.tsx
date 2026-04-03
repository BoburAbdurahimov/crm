import { Activity, ActivityType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  UserPlus, Phone, ArrowRightLeft, FileText,
  CreditCard, CheckCircle2, MessageSquare, Mail,
  Send, Globe, MessageCircle,
} from "lucide-react";

const activityIcons: Record<ActivityType, typeof UserPlus> = {
  lead_created: UserPlus,
  lead_contacted: Phone,
  lead_converted: ArrowRightLeft,
  lead_status_changed: ArrowRightLeft,
  client_created: UserPlus,
  project_created: FileText,
  project_status_changed: ArrowRightLeft,
  project_completed: CheckCircle2,
  payment_received: CreditCard,
  note_added: MessageSquare,
  email_sent: Mail,
  call_made: Phone,
  meeting_scheduled: FileText,
  proposal_sent: Send,
  form_submission: Globe,
  whatsapp_contact: MessageCircle,
  telegram_contact: Send,
};

const activityColors: Record<ActivityType, string> = {
  lead_created: "text-blue-500 bg-blue-500/10",
  lead_contacted: "text-yellow-500 bg-yellow-500/10",
  lead_converted: "text-green-500 bg-green-500/10",
  lead_status_changed: "text-purple-500 bg-purple-500/10",
  client_created: "text-green-500 bg-green-500/10",
  project_created: "text-blue-500 bg-blue-500/10",
  project_status_changed: "text-purple-500 bg-purple-500/10",
  project_completed: "text-green-500 bg-green-500/10",
  payment_received: "text-emerald-500 bg-emerald-500/10",
  note_added: "text-gray-500 bg-gray-500/10",
  email_sent: "text-blue-500 bg-blue-500/10",
  call_made: "text-yellow-500 bg-yellow-500/10",
  meeting_scheduled: "text-indigo-500 bg-indigo-500/10",
  proposal_sent: "text-orange-500 bg-orange-500/10",
  form_submission: "text-cyan-500 bg-cyan-500/10",
  whatsapp_contact: "text-green-500 bg-green-500/10",
  telegram_contact: "text-blue-500 bg-blue-500/10",
};

interface ActivityTimelineProps {
  activities: Activity[];
  className?: string;
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {activities.map((activity, i) => {
        const Icon = activityIcons[activity.type] || FileText;
        const color = activityColors[activity.type] || "text-gray-500 bg-gray-500/10";

        return (
          <div key={activity.id} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", color)}>
                <Icon className="w-4 h-4" />
              </div>
              {i < activities.length - 1 && (
                <div className="w-px flex-1 bg-border mt-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium leading-tight">
                {activity.entityName}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
