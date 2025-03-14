import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";
import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await request.json();

    // Get user's customers for context
    const { data: customers } = await supabase
      .from("customers")
      .select("id, name, email, company, status")
      .eq("user_id", user.id)
      .limit(10);

    // Get user's tasks for context
    const { data: tasks } = await supabase
      .from("tasks")
      .select("id, title, priority, status, due_date, customer_id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .limit(10);

    // Create system message with context
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant for CloudFlow CRM. You help users manage their customers and tasks.
      
You can help with:
1. Adding new customers
2. Creating tasks
3. Providing insights about their CRM data

Current user context:
- User: ${user.email}
- Customers: ${JSON.stringify(customers || [])}
- Pending Tasks: ${JSON.stringify(tasks || [])}

When the user wants to add a customer, extract the following information and respond with an action:
- name (required)
- email (optional)
- phone (optional)
- company (optional)
- status (should be one of: lead, active, inactive; default to lead if not specified)
- notes (optional)

When the user wants to create a task, extract the following information and respond with an action:
- title (required)
- description (optional)
- priority (should be one of: high, medium, low; default to medium if not specified)
- due_date (optional, in ISO format)
- customer_id (optional, should match an existing customer id if provided)

Format your response as a conversational message. If you're performing an action, include the action details in your response.`,
    };

    // Add system message to the beginning of the conversation
    const conversation = [systemMessage, ...messages];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0].message.content || "";

    // Check if the response contains action data
    let action = null;
    let actionData = null;
    let cleanMessage = assistantMessage;

    // Check for customer action
    const customerMatch = assistantMessage.match(
      /\{\s*"action"\s*:\s*"addCustomer"[^}]*\}/,
    );
    if (customerMatch) {
      try {
        const actionJson = JSON.parse(customerMatch[0]);
        action = "addCustomer";
        actionData = actionJson.data;
        cleanMessage = assistantMessage.replace(customerMatch[0], "").trim();
      } catch (e) {
        console.error("Error parsing customer action:", e);
      }
    }

    // Check for task action
    const taskMatch = assistantMessage.match(
      /\{\s*"action"\s*:\s*"addTask"[^}]*\}/,
    );
    if (taskMatch) {
      try {
        const actionJson = JSON.parse(taskMatch[0]);
        action = "addTask";
        actionData = actionJson.data;
        cleanMessage = assistantMessage.replace(taskMatch[0], "").trim();
      } catch (e) {
        console.error("Error parsing task action:", e);
      }
    }

    return NextResponse.json({
      message: cleanMessage,
      action,
      actionData,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
