"use client";

import { useState } from "react";
import Link from "next/link";
import { getProjects, getClients } from "@/lib/data-service";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Eye, LayoutGrid, List } from "lucide-react";
import { ProjectStatus } from "@/types";
import { format } from "date-fns";

const kanbanColumns: { status: ProjectStatus; label: string; color: string }[] = [
  { status: "planning", label: "Planning", color: "border-t-gray-500" },
  { status: "in_progress", label: "In Progress", color: "border-t-blue-500" },
  { status: "review", label: "Review", color: "border-t-yellow-500" },
  { status: "completed", label: "Completed", color: "border-t-green-500" },
  { status: "on_hold", label: "On Hold", color: "border-t-orange-500" },
];

export default function ProjectsPage() {
  const allProjects = getProjects();
  const allClients = getClients();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = allProjects.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">{allProjects.length} total projects</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button variant={view === "kanban" ? "secondary" : "ghost"} size="icon" className="h-9 w-9 rounded-none" onClick={() => setView("kanban")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-9 w-9 rounded-none" onClick={() => setView("table")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button><Plus className="w-4 h-4 mr-2" />New Project</Button>} />
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>Add a new project for a client.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Project Title *</Label><Input placeholder="Website Redesign" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client *</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                      <SelectContent>
                        {allClients.map((c) => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="telegram_bot">Telegram Bot</SelectItem>
                        <SelectItem value="mobile_app">Mobile App</SelectItem>
                        <SelectItem value="crm">CRM System</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="platform">Platform</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Price ($)</Label><Input type="number" placeholder="5000" /></div>
                  <div className="space-y-2"><Label>Deadline</Label><Input type="date" /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Project details..." rows={3} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        {view === "table" && (
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Kanban View */}
      {view === "kanban" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kanbanColumns.map((col) => {
            const colProjects = filtered.filter((p) => p.status === col.status);
            return (
              <div key={col.status} className="space-y-3">
                <div className={`flex items-center justify-between border-t-2 ${col.color} pt-2`}>
                  <h3 className="text-sm font-medium">{col.label}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{colProjects.length}</span>
                </div>
                <div className="space-y-3">
                  {colProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Card className="hover:border-primary/30 transition-colors cursor-pointer mb-3">
                        <CardContent className="p-4">
                          <p className="font-medium text-sm mb-1">{project.title}</p>
                          <p className="text-xs text-muted-foreground mb-3">{project.clientName}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Progress value={project.progress} className="flex-1 h-1.5" />
                            <span className="text-[10px] text-muted-foreground">{project.progress}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <StatusBadge status={project.priority} type="priority" className="text-[10px]" />
                            <span className="text-xs font-medium">${project.price.toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                  {colProjects.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                      No projects
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Progress</TableHead>
                  <TableHead className="hidden lg:table-cell">Price</TableHead>
                  <TableHead className="hidden lg:table-cell">Payment</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div><span className="font-medium text-sm">{project.title}</span><p className="text-xs text-muted-foreground">{project.serviceType}</p></div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{project.clientName}</TableCell>
                    <TableCell><StatusBadge status={project.status} type="project" /></TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="w-16 h-1.5" />
                        <span className="text-xs">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">${project.price.toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell"><StatusBadge status={project.paymentStatus} type="payment" /></TableCell>
                    <TableCell>
                      <Link href={`/projects/${project.id}`}><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
