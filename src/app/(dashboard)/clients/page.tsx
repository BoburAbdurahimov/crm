"use client";

import { useState } from "react";
import Link from "next/link";
import { getClients } from "@/lib/data-service";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye, LayoutGrid, List, Mail, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ClientsPage() {
  const allClients = getClients();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = allClients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-sm text-muted-foreground">
            {allClients.length} total • {allClients.filter((c) => c.status === "active").length} active
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button variant={view === "cards" ? "secondary" : "ghost"} size="icon" className="h-9 w-9 rounded-none" onClick={() => setView("cards")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === "table" ? "secondary" : "ghost"} size="icon" className="h-9 w-9 rounded-none" onClick={() => setView("table")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button><Plus className="w-4 h-4 mr-2" />Add Client</Button>} />
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Add a client manually.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="John Doe" /></div>
                  <div className="space-y-2"><Label>Company</Label><Input placeholder="Acme Corp" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="john@example.com" /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input placeholder="+998 90 123 45 67" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Country</Label><Input placeholder="Uzbekistan" /></div>
                  <div className="space-y-2"><Label>City</Label><Input placeholder="Tashkent" /></div>
                </div>
                <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Additional notes..." rows={3} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)}>Create Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
      </div>

      {/* Cards View */}
      {view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {client.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{client.fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">{client.company}</p>
                    </div>
                    <StatusBadge status={client.status} type="client" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Projects</p>
                      <p className="font-medium">{client.projectCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Total Spent</p>
                      <p className="font-medium">${client.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</span>
                  </div>
                  {client.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Projects</TableHead>
                  <TableHead className="hidden sm:table-cell">Total Spent</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium text-sm">{client.fullName}</span>
                        <p className="text-xs text-muted-foreground">{client.company}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{client.email}</TableCell>
                    <TableCell><StatusBadge status={client.status} type="client" /></TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{client.projectCount}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm font-medium">${client.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Link href={`/clients/${client.id}`}><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button></Link>
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
