import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardMetrics from "@/components/dashboard-metrics";
import RecentCustomers from "@/components/recent-customers";
import UpcomingTasks from "@/components/upcoming-tasks";
import AIAssistant from "@/components/ai-assistant";
import AdvancedAnalytics from "@/components/advanced-analytics";
import AIInsights from "@/components/ai-insights";
import NotificationCenter from "@/components/notification-center";
import CustomerInsightsAdvanced from "@/components/customer-insights-advanced";
import AdvancedTaskManager from "@/components/advanced-task-manager";
import IntegratedDashboard from "@/components/integrated-dashboard";
import { Button } from "@/components/ui/button";
import { InfoIcon, Plus, Search, UserCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../supabase/server";
import { ChatBot } from "@/components/chat-bot";

interface ChatHistory {
  id: string;
  user_id: string;
  message: string;
  response: string;
  created_at: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch initial chat history
  const { data: chatHistory } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(10);

  const initialMessages = (chatHistory as ChatHistory[])?.map((chat) => [
    {
      id: `${chat.id}-user`,
      role: "user" as const,
      content: chat.message,
      timestamp: chat.created_at,
    },
    {
      id: `${chat.id}-assistant`,
      role: "assistant" as const,
      content: chat.response,
      timestamp: chat.created_at,
    },
  ]).flat() as Message[] || [];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-white min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 w-8 h-8 rounded-md flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">My Workspace</h1>
                <p className="text-sm text-gray-500">
                  {user.user_metadata?.full_name || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <input
                  type="text"
                  placeholder="Search customers, tasks, or documents..."
                  className="pl-9 h-10 w-full sm:w-[350px] rounded-lg border border-gray-200 bg-white px-4 text-sm transition-all
                    focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 hover:border-gray-300"
                />
              </div>
              <Link href="/dashboard/customers">
                <Button className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 h-10 px-4 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  New Customer
                </Button>
              </Link>
            </div>
          </header>

          {/* Metrics Section */}
          <section>
            <DashboardMetrics />
          </section>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between border-b pb-3 mb-6">
              <TabsList className="h-9 bg-gray-100/80 p-1 rounded-lg">
                <TabsTrigger 
                  value="overview" 
                  className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                >
                  AI Insights
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-4">
                <NotificationCenter />
                <Button variant="outline" size="sm" className="h-9 border-gray-200 hover:bg-gray-50">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">Help</span>
                </Button>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <IntegratedDashboard />
              <div className="grid md:grid-cols-2 gap-6">
                <CustomerInsightsAdvanced />
                <AdvancedTaskManager />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AdvancedAnalytics />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <CustomerInsightsAdvanced />
              <AIInsights />
            </TabsContent>
          </Tabs>

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
          <ChatBot initialMessages={initialMessages} />
        </div>
      </main>
    </>
  );
}
