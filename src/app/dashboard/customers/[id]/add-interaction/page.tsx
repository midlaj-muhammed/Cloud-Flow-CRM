import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddInteractionForm from "@/components/add-interaction-form";

export default async function AddInteractionPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch customer
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!customer) {
    return redirect("/dashboard/customers");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/customers/${params.id}`}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Log Interaction</h1>
                <p className="text-muted-foreground">
                  Record a new interaction with {customer.name}
                </p>
              </div>
            </div>
          </header>

          {/* Add Interaction Form */}
          <div className="max-w-2xl mx-auto w-full">
            <AddInteractionForm
              customerId={params.id}
              customerName={customer.name}
            />
          </div>
        </div>
      </main>
    </>
  );
}
