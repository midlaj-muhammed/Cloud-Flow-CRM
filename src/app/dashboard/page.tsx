import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardMetrics from "@/components/dashboard-metrics";
import RecentCustomers from "@/components/recent-customers";
import UpcomingTasks from "@/components/upcoming-tasks";
import AIAssistant from "@/components/ai-assistant";
import { Button } from "@/components/ui/button";
import { InfoIcon, Plus, Search, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-8 h-9 w-full sm:w-[250px] rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Link href="/dashboard/customers">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
              </Link>
            </div>
          </header>

          {/* Metrics Section */}
          <section>
            <DashboardMetrics />
          </section>

          {/* Main Content */}
          <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <RecentCustomers />
            <div className="md:col-span-1">
              <UpcomingTasks />
            </div>
          </section>

          {/* User Profile Section - Keeping this for reference */}
          <section className="bg-card rounded-xl p-6 border shadow-sm hidden">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-primary" />
              <div>
                <h2 className="font-semibold text-xl">User Profile</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
              <pre className="text-xs font-mono max-h-48 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </section>

          {/* AI Assistant */}
          <AIAssistant />
        </div>
      </main>
    </>
  );
}
