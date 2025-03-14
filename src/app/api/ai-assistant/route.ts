import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

// Basic intent matching patterns
const PATTERNS = {
  ADD_CUSTOMER: /add\s+(a\s+)?customer|create\s+(a\s+)?customer|new\s+customer/i,
  ADD_TASK: /add\s+(a\s+)?task|create\s+(a\s+)?task|new\s+task/i,
  LIST_CUSTOMERS: /list\s+customers|show\s+customers|view\s+customers/i,
  LIST_TASKS: /list\s+tasks|show\s+tasks|view\s+tasks/i,
  HELP: /help|what can you do|commands|features/i
};

const HELP_MESSAGE = `I can help you manage your CRM. Here are some things you can ask me to do:

1. Add a customer - Example: "add a customer John Doe from ABC Company"
2. Create a task - Example: "create a task Follow up with client"
3. List customers - Example: "show my customers"
4. List tasks - Example: "show my pending tasks"

Just type your request in natural language and I'll help you out!`;

function extractCustomerInfo(message: string) {
  const words = message.split(' ');
  const nameStart = words.findIndex(w => w.toLowerCase() === 'customer') + 1;
  let name = words.slice(nameStart).join(' ');
  
  // Extract company if present
  const companyMatch = message.match(/from\s+(.+?)(?:\s+|$)/i);
  const company = companyMatch ? companyMatch[1] : undefined;
  
  // Remove company part from name if present
  if (company) {
    name = name.replace(/from\s+.+$/, '').trim();
  }

  return {
    name,
    company,
    status: 'lead'
  };
}

function extractTaskInfo(message: string) {
  const words = message.split(' ');
  const titleStart = words.findIndex(w => w.toLowerCase() === 'task') + 1;
  const title = words.slice(titleStart).join(' ');

  return {
    title,
    priority: 'medium',
    status: 'pending'
  };
}

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
    const userMessage = messages[messages.length - 1].content;

    // Handle different intents
    let response = {
      message: "",
      action: null as string | null,
      actionData: null as any
    };

    if (PATTERNS.HELP.test(userMessage)) {
      response.message = HELP_MESSAGE;
    }
    else if (PATTERNS.ADD_CUSTOMER.test(userMessage)) {
      const customerInfo = extractCustomerInfo(userMessage);
      response = {
        message: `I'll help you add a customer named ${customerInfo.name}${customerInfo.company ? ` from ${customerInfo.company}` : ''}.`,
        action: "addCustomer",
        actionData: customerInfo
      };
    }
    else if (PATTERNS.ADD_TASK.test(userMessage)) {
      const taskInfo = extractTaskInfo(userMessage);
      response = {
        message: `I'll create a task: ${taskInfo.title}`,
        action: "addTask",
        actionData: taskInfo
      };
    }
    else if (PATTERNS.LIST_CUSTOMERS.test(userMessage)) {
      const { data: customers } = await supabase
        .from("customers")
        .select("name, company, status")
        .eq("user_id", user.id)
        .limit(5);

      response.message = customers && customers.length > 0
        ? `Here are your recent customers:\n${customers.map(c => `- ${c.name}${c.company ? ` (${c.company})` : ''} - ${c.status}`).join('\n')}`
        : "You don't have any customers yet. Would you like to add one?";
    }
    else if (PATTERNS.LIST_TASKS.test(userMessage)) {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("title, priority, status")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .limit(5);

      response.message = tasks && tasks.length > 0
        ? `Here are your pending tasks:\n${tasks.map(t => `- ${t.title} (${t.priority} priority)`).join('\n')}`
        : "You don't have any pending tasks. Would you like to create one?";
    }
    else {
      response.message = "I understand you're trying to manage your CRM. Could you please be more specific? Type 'help' to see what I can do.";
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
