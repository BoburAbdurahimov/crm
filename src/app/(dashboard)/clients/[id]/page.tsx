"use client";

import { getClientById, getProjectsByClientId, getActivities } from "@/lib/data-service";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActivityTimeline } from "@/components/shared/activity-timeline";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Mail, Phone, MapPin, Building2,
  DollarSign, Calendar, FolderKanban,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { use } from "react";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const client = getClientById(id);
  const projects = client ? getProjectsByClientId(id) : [];
  const activities = getActivities({ entityId: id });

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">Client not found</p>
        <Link href="/clients"><Button variant="outline">Back to Clients</Button></Link>
      </div>
    );
  }

  const totalPaid = projects.reduce((s, p) => s + p.amountPaid, 0);
  const totalPrice = projects.reduce((s, p) => s + p.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/clients"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h2 className="text-2xl font-bold">{client.fullName}</h2>
            <p className="text-sm text-muted-foreground">{client.company}</p>
          </div>
          <StatusBadge status={client.status} type="client" />
        </div>
        <Button variant="outline">Edit Client</Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{client.email}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{client.phone || "—"}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium">{[client.city, client.country].filter(Boolean).join(", ") || "—"}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Client Since</p><p className="text-sm font-medium">{format(new Date(client.registrationDate), "MMM dd, yyyy")}</p></div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader><CardTitle className="text-base">Payment Summary</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-2xl font-bold">${totalPrice.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Value</p></div>
                    <div><p className="text-2xl font-bold text-green-500">${totalPaid.toLocaleString()}</p><p className="text-xs text-muted-foreground">Paid</p></div>
                    <div><p className="text-2xl font-bold text-yellow-500">${(totalPrice - totalPaid).toLocaleString()}</p><p className="text-xs text-muted-foreground">Remaining</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Projects</span><span className="font-medium">{client.projectCount}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Spent</span><span className="font-medium">${client.totalSpent.toLocaleString()}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Preferred Contact</span><span className="font-medium capitalize">{client.preferredContact}</span></div>
                  {client.tags.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex flex-wrap gap-1.5">
                        {client.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-6 space-y-4">
          {projects.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No projects yet</CardContent></Card>
          ) : (
            projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.serviceType}</p>
                      </div>
                      <div className="flex gap-2">
                        <StatusBadge status={project.status} type="project" />
                        <StatusBadge status={project.paymentStatus} type="payment" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress} className="flex-1 h-2" />
                      <span className="text-xs font-medium w-10 text-right">{project.progress}%</span>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>${project.amountPaid.toLocaleString()} / ${project.price.toLocaleString()}</span>
                      {project.deadline && <span>Due: {format(new Date(project.deadline), "MMM dd, yyyy")}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Activity Timeline</CardTitle></CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <ActivityTimeline activities={activities} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {client.notes && <p className="text-sm text-muted-foreground">{client.notes}</p>}
              <Textarea placeholder="Add a note..." rows={3} />
              <Button size="sm">Add Note</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
