"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const PIE_COLORS = ["#6b7280", "#3b82f6", "#eab308", "#22c55e", "#f97316", "#ef4444"];

interface DashboardChartsProps {
  stats: {
    revenueByMonth: any[];
    totalProjects: number;
    projectsByStatus: Record<string, number>;
  };
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const pieData = [
    { name: "Planning", value: stats.projectsByStatus.planning || 0 },
    { name: "In Progress", value: stats.projectsByStatus.in_progress || 0 },
    { name: "Review", value: stats.projectsByStatus.review || 0 },
    { name: "Completed", value: stats.projectsByStatus.completed || 0 },
    { name: "On Hold", value: stats.projectsByStatus.on_hold || 0 },
    { name: "Cancelled", value: stats.projectsByStatus.cancelled || 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-7">
      {/* Revenue Chart */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue for the current period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Projects Donut */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Projects by Status</CardTitle>
          <CardDescription>{stats.totalProjects} total projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
