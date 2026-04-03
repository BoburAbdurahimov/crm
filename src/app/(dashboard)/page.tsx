import { StatCard } from "@/components/shared/stat-card";
import { ActivityTimeline } from "@/components/shared/activity-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { DashboardCharts } from "@/components/dashboard/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users, UserPlus, FolderKanban, DollarSign,
  AlertCircle, ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  getDashboardStats, getLeads, getActivities, getProjects,
} from "@/lib/data-service";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentLeads = getLeads().slice(0, 5);
  const recentActivities = getActivities({ limit: 8 });
  const activeProjects = getProjects({ status: "in_progress" });

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={UserPlus}
          trend={{ value: `+${stats.leadsThisMonth} this month`, positive: true }}
        />
        <StatCard
          title="Active Clients"
          value={stats.totalClients}
          icon={Users}
          description="currently active"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: "+12%", positive: true }}
        />
        <StatCard
          title="Completed Projects"
          value={`${stats.completedProjects}/${stats.totalProjects}`}
          icon={FolderKanban}
          description={`${stats.inProgressProjects} in progress`}
        />
      </div>

      {/* Alert for unread leads */}
      {recentLeads.some(l => l.unread) && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                You have {recentLeads.filter(l => l.unread).length} unread lead(s) from the Landing Page
              </p>
              <p className="text-xs text-muted-foreground">Review them in the Leads section</p>
            </div>
            <Link href="/leads" className="text-sm text-blue-500 font-medium hover:underline flex items-center gap-1">
              View <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <DashboardCharts stats={stats} />

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Leads</CardTitle>
              <CardDescription>Latest incoming lead inquiries</CardDescription>
            </div>
            <Link href="/leads" className="text-xs text-primary hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link key={lead.id} href={`/leads/${lead.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-primary">
                      {lead.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{lead.fullName}</p>
                      {lead.unread && (
                        <Badge variant="destructive" className="h-4 px-1 text-[9px]">NEW</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {lead.serviceRequested} • {lead.source}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} type="lead" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest events across your CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={recentActivities} />
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Active Projects</CardTitle>
              <CardDescription>{activeProjects.length} projects in progress</CardDescription>
            </div>
            <Link href="/projects" className="text-xs text-primary hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="block p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">{project.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${project.amountPaid.toLocaleString()} / ${project.price.toLocaleString()}</p>
                      <StatusBadge status={project.paymentStatus} type="payment" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-xs font-medium text-muted-foreground w-10 text-right">{project.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
