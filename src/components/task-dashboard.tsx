"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  LayoutGrid,
  List,
  PlayCircle,
  Tags,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { DataTable } from "./ui/data-table";
import { ProgressCircle } from "./ui/progress-circle";

interface TaskDashboardProps {
  tasks: any[];
}

export default function TaskDashboard({ tasks }: TaskDashboardProps) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [timeRange, setTimeRange] = useState("7d");

  // Calculate task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;
  const reviewTasks = tasks.filter((t) => t.status === "review").length;

  // Task completion rate
  const completionRate = ((completedTasks / totalTasks) * 100).toFixed(1);

  // Task priority distribution
  const priorityData = [
    {
      name: "High",
      tasks: tasks.filter((t) => t.priority === "high").length,
    },
    {
      name: "Medium",
      tasks: tasks.filter((t) => t.priority === "medium").length,
    },
    {
      name: "Low",
      tasks: tasks.filter((t) => t.priority === "low").length,
    },
  ];

  // Task completion trend (mock data - replace with actual data)
  const completionTrend = [
    { date: "Mon", completed: 5, total: 8 },
    { date: "Tue", completed: 7, total: 10 },
    { date: "Wed", completed: 4, total: 6 },
    { date: "Thu", completed: 8, total: 12 },
    { date: "Fri", completed: 6, total: 9 },
    { date: "Sat", completed: 3, total: 5 },
    { date: "Sun", completed: 2, total: 4 },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <Tags className="h-4 w-4 text-black" />
          </div>
          <p className="text-2xl font-bold">{totalTasks}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 bg-green-50">
              +8%
            </Badge>
            <span className="text-xs text-gray-500">vs last week</span>
          </div>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{completionRate}%</p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-black h-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
            <PlayCircle className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{inProgressTasks}</p>
          <p className="text-xs text-gray-500">
            {((inProgressTasks / totalTasks) * 100).toFixed(1)}% of total
          </p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Due Soon</h3>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs text-gray-500">Due in next 48 hours</p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Task Completion Trend</h3>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#000"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#999"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Task Priority Distribution</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Task Status Overview */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6">Task Status Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <ProgressCircle value={todoTasks} max={totalTasks} />
              <div>
                <p className="font-medium">To Do</p>
                <p className="text-sm text-gray-500">{todoTasks} tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressCircle
                value={inProgressTasks}
                max={totalTasks}
                className="text-blue-500"
              />
              <div>
                <p className="font-medium">In Progress</p>
                <p className="text-sm text-gray-500">{inProgressTasks} tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressCircle
                value={reviewTasks}
                max={totalTasks}
                className="text-purple-500"
              />
              <div>
                <p className="font-medium">In Review</p>
                <p className="text-sm text-gray-500">{reviewTasks} tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressCircle
                value={completedTasks}
                max={totalTasks}
                className="text-green-500"
              />
              <div>
                <p className="font-medium">Completed</p>
                <p className="text-sm text-gray-500">{completedTasks} tasks</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Task List Section */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Task List</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Task list/grid view will be implemented here */}
          <p className="text-sm text-gray-500">Task list coming soon...</p>
        </div>
      </Card>
    </div>
  );
}
