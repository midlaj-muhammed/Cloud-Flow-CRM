import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Search } from "lucide-react";
import AddCustomerDialog from "@/components/add-customer-dialog";
import AIAssistant from "@/components/ai-assistant";
import CustomerDashboard from "@/components/customer-dashboard";
import { Card } from "@/components/ui/card";

export default async function CustomersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch customers
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Customers</h1>
              <p className="text-muted-foreground mt-1">
                Manage and analyze your customer relationships
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-8 h-9 w-full sm:w-[250px] rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-all focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                />
              </div>
              <AddCustomerDialog />
            </div>
          </header>

          {/* Customer Dashboard */}
          <CustomerDashboard customers={customers || []} />

          {/* AI Assistant */}
          <Card className="p-6">
            <AIAssistant />
          </Card>
        </div>
      </main>
    </>
  );
}
