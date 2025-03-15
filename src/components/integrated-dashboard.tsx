"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import DataEditor from "./data-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Brain,
  Calendar,
  ChevronRight,
  CreditCard,
  DollarSign,
  Flag,
  Heart,
  LineChart,
  MessageSquare,
  Plus,
  Star,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Customer, Task } from "@/types/crm";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  value?: string;
  status?: string;
  user_id: string;
}

interface RelatedTask {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  assignee: {
    name: string;
    avatar: string;
  };
  user_id: string;
  description: string;
}

interface CustomerMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

const customerMetrics: CustomerMetric[] = [
  {
    title: "Lifetime Value",
    value: "$12,345",
    change: "+12%",
    trend: "up",
  },
  {
    title: "Total Orders",
    value: "48",
    change: "+8%",
    trend: "up",
  },
  {
    title: "Support Tickets",
    value: "3",
    change: "-25%",
    trend: "down",
  },
  {
    title: "Last Purchase",
    value: "14d ago",
    change: "",
    trend: "up",
  },
];

const recentActivity: Activity[] = [
  {
    id: "1",
    type: "customer",
    title: "New Customer",
    description: "John Doe from Acme Corp",
    timestamp: "2h ago",
    user_id: "user1",
  },
  {
    id: "2",
    type: "support",
    title: "API integration inquiry",
    description: "Customer requested API integration",
    timestamp: "5h ago",
    user_id: "user1",
  },
  {
    id: "3",
    type: "feedback",
    title: "Product feedback submitted",
    description: "Customer submitted product feedback",
    timestamp: "1d ago",
    user_id: "user1",
  },
];

const relatedTasks: RelatedTask[] = [
  {
    id: "1",
    title: "Follow up meeting",
    dueDate: "2024-03-20",
    priority: "high",
    assignee: {
      name: "John Doe",
      avatar: "/avatars/john.jpg",
    },
    user_id: "user1",
    description: "Discuss project requirements",
  },
  {
    id: "2",
    title: "Integration Support",
    dueDate: "2024-03-25",
    priority: "medium",
    assignee: {
      name: "Alex Kumar",
      avatar: "/avatars/alex.jpg",
    },
    user_id: "user1",
    description: "Provide integration support",
  },
];

const aiRecommendations = [
  {
    title: "Upsell Opportunity",
    description: "Customer shows high engagement with current features",
    impact: "Potential +$2,400/year",
    priority: "high",
  },
  {
    title: "Proactive Support",
    description: "Usage patterns indicate potential API issues",
    impact: "Prevent possible churn",
    priority: "medium",
  },
];

export default function IntegratedDashboard() {
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");

  const handleCustomerSave = (data: Customer | Task) => {
    if ("name" in data) {
      console.log("Saving customer data:", data);
      // Implement customer save logic
    }
  };

  const handleTaskSave = (data: Customer | Task) => {
    if ("title" in data) {
      console.log("Saving task data:", data);
      // Implement task save logic
    }
  };

  const handleDelete = (id: string) => {
    console.log("Deleting item:", id);
    // Implement delete logic
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Customer & Task Hub
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Unified view of customer insights and related tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="h-9 text-sm border-gray-200">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-9 text-sm gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {customerMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-sm transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-700">
                {metric.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  metric.trend === "up"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <LineChart className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <p
                className={`text-xs font-medium mt-1 ${
                  metric.trend === "up"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity & Tasks */}
        <Card>
          <CardHeader>
            <Tabs defaultValue="activity" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="h-9">
                  <TabsTrigger value="activity" className="text-sm">
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="text-sm">
                    Tasks
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" className="h-8 px-2 text-gray-500">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="activity" className="m-0">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg border"
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        activity.type === "customer"
                          ? "bg-emerald-50 text-emerald-600"
                          : activity.type === "support"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {activity.type === "customer" ? (
                        <Users className="h-4 w-4" />
                      ) : activity.type === "support" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                    <DataEditor
                      type="customer"
                      data={{
                        id: activity.id,
                        user_id: activity.user_id,
                        name: "",
                        email: "",
                        company: "",
                        type: "business",
                        status: "active",
                        tags: [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }}
                      onSave={handleCustomerSave}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="m-0">
              <div className="space-y-4">
                {relatedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-4 p-3 rounded-lg border"
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        task.priority === "high"
                          ? "bg-red-50 text-red-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      <Flag className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <DataEditor
                      type="task"
                      data={{
                        id: task.id,
                        user_id: task.user_id,
                        title: task.title,
                        description: task.description,
                        due_date: task.dueDate,
                        priority: task.priority as "high" | "medium" | "low",
                        status: "todo",
                        tags: [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }}
                      onSave={handleTaskSave}
                      onDelete={handleDelete}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.assignee.avatar} />
                      <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Smart recommendations and alerts
                </CardDescription>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Brain className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      recommendation.priority === "high"
                        ? "bg-red-50 text-red-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {recommendation.title}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          recommendation.priority === "high"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {recommendation.description}
                    </p>
                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      {recommendation.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
