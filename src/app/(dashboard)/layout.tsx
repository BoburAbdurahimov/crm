import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getUnreadLeadCount, getNotifications } from "@/lib/data-service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadLeads = getUnreadLeadCount();
  const notifications = getNotifications();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar unreadLeads={unreadLeads} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header notifications={notifications} unreadCount={unreadNotifs} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
