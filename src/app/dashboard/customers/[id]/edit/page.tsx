import { createClient } from "../../../../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card } from "@/components/ui/card";
import { Customer } from "@/types/crm";
import dynamic from "next/dynamic";

const CustomerEditForm = dynamic<{ customer: Customer }>(
  () => import("../../../../../components/customer-edit-form"),
  { ssr: false }
);

export default async function EditCustomerPage({
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

  // Fetch customer data
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
        <div className="container mx-auto px-4 py-8 max-w-[800px]">
          <Card className="p-6 border border-gray-200 shadow-lg rounded-lg bg-white">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Edit Customer
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Update customer information and preferences
                </p>
              </div>
              <CustomerEditForm customer={customer} />
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
