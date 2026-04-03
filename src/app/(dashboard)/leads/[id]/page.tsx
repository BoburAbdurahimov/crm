"use client";

import { getLeadById, getActivities } from "@/lib/data-service";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActivityTimeline } from "@/components/shared/activity-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Mail, Phone, Building2, DollarSign,
  Calendar, MessageSquare, ArrowRightLeft, Globe,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { use } from "react";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lead = getLeadById(id);
  const activities = getActivities({ entityId: id });

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">Lead not found</p>
        <Link href="/leads"><Button variant="outline">Back to Leads</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/leads">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{lead.fullName}</h2>
              {lead.unread && <Badge variant="destructive" className="text-[10px]">UNREAD</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{lead.companyName || "No company"} • {lead.source}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button>
            <ArrowRightLeft className="w-4 h-4 mr-2" />Convert to Client
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{lead.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Service Requested</p>
                  <p className="text-sm font-medium">{lead.serviceRequested || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Budget</p>
                  <p className="text-sm font-medium">
                    {lead.estimatedBudget ? `$${lead.estimatedBudget.toLocaleString()}` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-medium">{lead.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium">{format(new Date(lead.submittedAt), "MMM dd, yyyy HH:mm")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Message */}
          {lead.inquiryMessage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Inquiry Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{lead.inquiryMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.notes && (
                <p className="text-sm text-muted-foreground">{lead.notes}</p>
              )}
              <Textarea placeholder="Add a note..." rows={3} />
              <Button size="sm">Add Note</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusBadge status={lead.status} type="lead" />
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">First Contact</span>
                  <span>{format(new Date(lead.firstContactDate), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Contact</span>
                  <span>{format(new Date(lead.lastContactDate), "MMM dd, yyyy")}</span>
                </div>
              </div>
              {lead.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <ActivityTimeline activities={activities} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
