import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured. Please add it to your environment variables.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function handleCommand(command: string, userId: string) {
  switch (command) {
    // Task Management
    case "/tasks":
      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending")
        .order("due_date", { ascending: true })
        .limit(5);
      
      return tasks?.map(task => 
        `- ${task.title} (Due: ${new Date(task.due_date).toLocaleDateString()})`
      ).join("\n") || "No pending tasks found.";

    case "/task-add":
      return "To add a new task, please provide the following information:\n- Title\n- Due date\n- Priority (Low/Medium/High)\n- Description";

    case "/task-complete":
      const { data: pendingTasks } = await supabase
        .from("tasks")
        .select("id, title")
        .eq("user_id", userId)
        .eq("status", "pending")
        .order("due_date", { ascending: true })
        .limit(5);
      
      return `Select a task to mark as complete:\n${
        pendingTasks?.map((task, index) => `${index + 1}. ${task.title}`).join("\n")
      }`;

    case "/task-priority":
      const { data: priorityTasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("priority", "high")
        .eq("status", "pending")
        .order("due_date", { ascending: true });
      
      return priorityTasks?.map(task =>
        `- ${task.title} (Due: ${new Date(task.due_date).toLocaleDateString()})`
      ).join("\n") || "No high priority tasks found.";

    case "/task-overdue":
      const currentDate = new Date().toISOString();
      const { data: overdueTasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending")
        .lt("due_date", currentDate)
        .order("due_date", { ascending: true });
      
      return overdueTasks?.map(task =>
        `- ${task.title} (Due: ${new Date(task.due_date).toLocaleDateString()})`
      ).join("\n") || "No overdue tasks found.";

    // Customer Management
    case "/customers":
      const { data: customers } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      
      return customers?.map(customer =>
        `- ${customer.name} (${customer.email})`
      ).join("\n") || "No recent customers found.";

    case "/customer-add":
      return "To add a new customer, please provide the following information:\n- Name\n- Email\n- Phone\n- Company (optional)\n- Notes (optional)";

    case "/customer-search":
      return "Please provide a search term to find customers by name, email, or company.";

    case "/customer-segment":
      const { data: segments } = await supabase
        .from("customer_segments")
        .select("name, customer_count")
        .eq("user_id", userId)
        .order("customer_count", { ascending: false });
      
      return segments?.map(segment =>
        `- ${segment.name} (${segment.customer_count} customers)`
      ).join("\n") || "No customer segments found.";

    case "/customer-activity":
      interface CustomerActivity {
        id: string;
        action: string;
        created_at: string;
        customer: {
          name: string;
        } | null;
      }

      const { data: activities } = await supabase
        .from("customer_activities")
        .select(`
          id,
          action,
          created_at,
          customer:customers (name)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      
      const typedActivities = activities as CustomerActivity[] | null;
      return typedActivities?.map(activity =>
        `- ${activity.customer?.name || 'Unknown'}: ${activity.action} (${new Date(activity.created_at).toLocaleString()})`
      ).join("\n") || "No recent customer activities found.";

    // Analytics & Reports
    case "/analytics":
      const { data: analytics } = await supabase
        .from("analytics")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (!analytics) return "No analytics data available.";
      
      return `Analytics Summary:
- Total Customers: ${analytics.total_customers}
- Active Tasks: ${analytics.active_tasks}
- Completed Tasks: ${analytics.completed_tasks}
- Customer Growth: ${analytics.customer_growth}%
- Chat Interactions: ${analytics.chat_interactions}`;

    case "/report-daily":
      const dailyStats = await getDailyStats(userId);
      return formatReport("Daily", dailyStats);

    case "/report-weekly":
      const weeklyStats = await getWeeklyStats(userId);
      return formatReport("Weekly", weeklyStats);

    case "/report-monthly":
      const monthlyStats = await getMonthlyStats(userId);
      return formatReport("Monthly", monthlyStats);

    case "/report-export":
      return "Please specify the report type (daily/weekly/monthly) and format (PDF/CSV/JSON) to export.";

    // Schedule & Calendar
    case "/schedule":
      const scheduleDate = new Date().toISOString().split("T")[0];
      const { data: schedule } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .gte("due_date", scheduleDate)
        .lte("due_date", scheduleDate + "T23:59:59")
        .order("due_date", { ascending: true });
      
      return schedule?.map(task =>
        `- ${task.title} (${new Date(task.due_date).toLocaleTimeString()})`
      ).join("\n") || "No tasks scheduled for today.";

    case "/schedule-week":
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const { data: weekSchedule } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .gte("due_date", weekStart.toISOString())
        .lte("due_date", weekEnd.toISOString())
        .order("due_date", { ascending: true });

      return weekSchedule?.map(task =>
        `- ${new Date(task.due_date).toLocaleDateString()}: ${task.title}`
      ).join("\n") || "No tasks scheduled for this week.";

    case "/schedule-month":
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);

      const { data: monthSchedule } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .gte("due_date", monthStart.toISOString())
        .lte("due_date", monthEnd.toISOString())
        .order("due_date", { ascending: true });

      return monthSchedule?.map(task =>
        `- ${new Date(task.due_date).toLocaleDateString()}: ${task.title}`
      ).join("\n") || "No tasks scheduled for this month.";

    case "/schedule-add":
      return "To add a new schedule item, please provide:\n- Title\n- Date and Time\n- Duration (optional)\n- Description (optional)";

    // Notes & Documentation
    case "/note-add":
      return "Please provide the note content. You can use markdown formatting.";

    case "/notes":
      const { data: notes } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      return notes?.map(note =>
        `- ${note.title} (${new Date(note.created_at).toLocaleDateString()})`
      ).join("\n") || "No notes found.";

    case "/docs":
      const { data: docs } = await supabase
        .from("documentation")
        .select("*")
        .order("category", { ascending: true });

      return docs?.map(doc =>
        `${doc.category}:\n- ${doc.title}`
      ).join("\n") || "No documentation available.";

    case "/docs-search":
      return "Please provide a search term to find documentation.";

    // System & Settings
    case "/settings":
      const { data: settings } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      return settings ? `Current Settings:
- Theme: ${settings.theme}
- Language: ${settings.language}
- Notifications: ${settings.notifications_enabled ? "Enabled" : "Disabled"}
- Email Updates: ${settings.email_updates ? "Enabled" : "Disabled"}` : "No settings found.";

    case "/theme":
      return "Available themes:\n- Light\n- Dark\n- System\n\nPlease specify your preferred theme.";

    case "/language":
      return "Available languages:\n- English\n- Spanish\n- French\n- German\n\nPlease specify your preferred language.";

    case "/notifications":
      return "Notification settings:\n- Task reminders\n- Customer updates\n- Report summaries\n- System notifications\n\nPlease specify which notifications to enable/disable.";

    case "/help":
      return `Available Commands:

Task Management:
/tasks - Show pending tasks
/task-add - Add a new task
/task-complete - Mark a task as complete
/task-priority - Show high priority tasks
/task-overdue - Show overdue tasks

Customer Management:
/customers - Show recent customers
/customer-add - Add a new customer
/customer-search - Search for a customer
/customer-segment - Show customer segments
/customer-activity - Show recent customer activities

Analytics & Reports:
/analytics - Show analytics summary
/report-daily - Generate daily report
/report-weekly - Generate weekly report
/report-monthly - Generate monthly report
/report-export - Export current report

Schedule & Calendar:
/schedule - Show today's schedule
/schedule-week - Show this week's schedule
/schedule-month - Show this month's schedule
/schedule-add - Add a new schedule item

Notes & Documentation:
/note-add - Add a new note
/notes - Show recent notes
/docs - Show documentation
/docs-search - Search documentation

System & Settings:
/settings - Show bot settings
/theme - Change theme
/language - Change language
/notifications - Manage notifications
/help - Show this help message`;

    default:
      return null;
  }
}

async function getDailyStats(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_stats")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .single();
  return data;
}

async function getWeeklyStats(userId: string) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const { data } = await supabase
    .from("weekly_stats")
    .select("*")
    .eq("user_id", userId)
    .eq("week_start", weekStart.toISOString().split("T")[0])
    .single();
  return data;
}

async function getMonthlyStats(userId: string) {
  const monthStart = new Date();
  monthStart.setDate(1);
  const { data } = await supabase
    .from("monthly_stats")
    .select("*")
    .eq("user_id", userId)
    .eq("month_start", monthStart.toISOString().split("T")[0])
    .single();
  return data;
}

function formatReport(type: string, stats: any) {
  if (!stats) return `No ${type.toLowerCase()} statistics available.`;

  return `${type} Report:
- New Customers: ${stats.new_customers}
- Tasks Completed: ${stats.tasks_completed}
- Active Tasks: ${stats.active_tasks}
- Customer Interactions: ${stats.customer_interactions}
- Average Response Time: ${stats.avg_response_time}ms
- Success Rate: ${stats.success_rate}%`;
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Get user context from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Handle custom commands
    if (message.startsWith("/")) {
      const commandResponse = await handleCommand(message, session.user.id);
      if (commandResponse) {
        return NextResponse.json({ message: commandResponse });
      }
    }

    // Get user's recent activities and tasks
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Prepare context for the AI
    const context = `
      You are an AI assistant for Cloud Flow CRM. The user is ${session.user.email}.
      Recent activities: ${activities?.map(a => a.description).join(", ")}
      Recent tasks: ${tasks?.map(t => t.title).join(", ")}

      Available commands:
      - Task Management: /tasks, /task-add, /task-complete, /task-priority, /task-overdue
      - Customer Management: /customers, /customer-add, /customer-search, /customer-segment, /customer-activity
      - Analytics & Reports: /analytics, /report-daily, /report-weekly, /report-monthly, /report-export
      - Schedule & Calendar: /schedule, /schedule-week, /schedule-month, /schedule-add
      - Notes & Documentation: /note-add, /notes, /docs, /docs-search
      - System & Settings: /settings, /theme, /language, /notifications, /help

      If the user asks about any feature without using commands,
      provide relevant information and suggest using the appropriate command for more details.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: context,
        },
        ...history,
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const reply = completion.choices[0].message.content;

    // Save the conversation to Supabase
    await supabase.from("chat_history").insert({
      user_id: session.user.id,
      message,
      response: reply,
      command_type: message.startsWith("/") ? message.split(" ")[0] : null,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
