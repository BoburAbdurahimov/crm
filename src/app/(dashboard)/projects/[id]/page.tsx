"use client";

import { getProjectById, getActivities } from "@/lib/data-service";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActivityTimeline } from "@/components/shared/activity-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Calendar, User, Clock, Target,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { use } from "react";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = getProjectById(id);
  const activities = getActivities({ entityId: id });

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">Project not found</p>
        <Link href="/projects"><Button variant="outline">Back to Projects</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/projects"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <p className="text-sm text-muted-foreground">{project.clientName} • {project.serviceType}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={project.status} type="project" />
          <StatusBadge status={project.priority} type="priority" />
          <Button variant="outline">Edit</Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-2xl font-bold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Project Details */}
              <Card>
                <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Client</p><p className="text-sm font-medium">{project.clientName}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Assigned To</p><p className="text-sm font-medium">{project.assignedTo || "Unassigned"}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="text-sm font-medium">{project.startDate ? format(new Date(project.startDate), "MMM dd, yyyy") : "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-medium">{project.deadline ? format(new Date(project.deadline), "MMM dd, yyyy") : "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {project.description && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p></CardContent>
                </Card>
              )}

              {/* Requirements */}
              {project.requirements && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Requirements & Scope</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{project.requirements}</p></CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Card */}
              <Card>
                <CardHeader><CardTitle className="text-base">Payment</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">${project.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Price</p>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid</span>
                      <span className="font-medium text-green-500">${project.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium text-yellow-500">${project.remainingAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <StatusBadge status={project.paymentStatus} type="payment" />
                  </div>
                  <Progress value={(project.amountPaid / project.price) * 100} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {Math.round((project.amountPaid / project.price) * 100)}% paid
                  </p>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader><CardTitle className="text-base">Timeline</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start</span>
                    <span>{project.startDate ? format(new Date(project.startDate), "MMM dd, yyyy") : "TBD"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span>{project.deadline ? format(new Date(project.deadline), "MMM dd, yyyy") : "TBD"}</span>
                  </div>
                  {project.deliveryDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivered</span>
                      <span className="text-green-500">{format(new Date(project.deliveryDate), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
            <CardContent>
              {activities.length > 0 ? <ActivityTimeline activities={activities} /> : (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {project.notes && <p className="text-sm text-muted-foreground">{project.notes}</p>}
              <Textarea placeholder="Add a note..." rows={3} />
              <Button size="sm">Add Note</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
