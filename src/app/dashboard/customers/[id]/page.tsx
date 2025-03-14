import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerInteractions from "@/components/customer-interactions";
import CustomerTasks from "@/components/customer-tasks";
import CustomerInsights from "@/components/customer-insights";

export default async function CustomerDetailsPage({
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

  // Fetch interactions
  const { data: interactions } = await supabase
    .from("interactions")
    .select("*")
    .eq("customer_id", params.id)
    .order("date", { ascending: false });

  // Fetch tasks
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("customer_id", params.id)
    .order("due_date", { ascending: true });

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/customers">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{customer.name}</h1>
                <p className="text-muted-foreground">
                  {customer.company ? `${customer.company} • ` : ""}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-800"
                        : customer.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {customer.status.charAt(0).toUpperCase() +
                      customer.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/dashboard/customers/${params.id}/edit`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Link href={`/dashboard/customers/${params.id}/add-interaction`}>
                <Button className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Log Interaction
                </Button>
              </Link>
            </div>
          </header>

          {/* Customer Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h3>
                  <p>{customer.email || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h3>
                  <p>{customer.phone || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Company
                  </h3>
                  <p>{customer.company || "Not provided"}</p>
                </div>
                {customer.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Notes
                    </h3>
                    <p className="whitespace-pre-line">{customer.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Tabs defaultValue="interactions">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="interactions">
                    Interactions ({interactions?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="tasks">
                    Tasks ({tasks?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="interactions" className="mt-4">
                  <CustomerInteractions
                    customerId={params.id}
                    initialInteractions={interactions || []}
                  />
                </TabsContent>
                <TabsContent value="tasks" className="mt-4">
                  <CustomerTasks
                    customerId={params.id}
                    initialTasks={tasks || []}
                  />
                </TabsContent>
                <TabsContent value="insights" className="mt-4">
                  <CustomerInsights
                    customerId={params.id}
                    customerData={customer}
                    interactionData={interactions || []}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
