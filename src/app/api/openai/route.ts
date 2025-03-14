import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import {
  generateCustomerInsights,
  suggestFollowUpTasks,
  summarizeInteraction,
} from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, data } = await request.json();

    switch (action) {
      case "generateInsights": {
        const { customerId } = data;

        // Get customer data
        const { data: customer } = await supabase
          .from("customers")
          .select("*")
          .eq("id", customerId)
          .eq("user_id", user.id)
          .single();

        if (!customer) {
          return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 },
          );
        }

        // Get interactions
        const { data: interactions } = await supabase
          .from("interactions")
          .select("*")
          .eq("customer_id", customerId)
          .order("date", { ascending: false });

        const insights = await generateCustomerInsights({
          customer,
          interactions: interactions || [],
        });

        return NextResponse.json({ insights });
      }

      case "suggestTasks": {
        const { customerId } = data;

        // Get customer data
        const { data: customer } = await supabase
          .from("customers")
          .select("*")
          .eq("id", customerId)
          .eq("user_id", user.id)
          .single();

        if (!customer) {
          return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 },
          );
        }

        // Get interactions
        const { data: interactions } = await supabase
          .from("interactions")
          .select("*")
          .eq("customer_id", customerId)
          .order("date", { ascending: false });

        const suggestions = await suggestFollowUpTasks(
          customer,
          interactions || [],
        );

        return NextResponse.json({ suggestions });
      }

      case "summarizeInteraction": {
        const { details } = data;

        if (!details) {
          return NextResponse.json(
            { error: "Interaction details required" },
            { status: 400 },
          );
        }

        const summary = await summarizeInteraction(details);
        return NextResponse.json({ summary });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
