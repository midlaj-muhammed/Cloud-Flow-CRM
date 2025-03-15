"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertCircle,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Flag,
  MoreVertical,
  Plus,
  Tags,
  Timer,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "review" | "done";
  dueDate: string;
  progress: number;
  tags: string[];
  assignees: {
    name: string;
    avatar: string;
    initials: string;
  }[];
  aiSuggestions?: {
    title: string;
    description: string;
    impact: string;
  }[];
}

const tasks: Task[] = [
  {
    id: "1",
    title: "Quarterly Business Review",
    description: "Prepare and present Q1 performance metrics",
    priority: "high",
    status: "in_progress",
    dueDate: "2025-03-20",
    progress: 65,
    tags: ["presentation", "quarterly", "metrics"],
    assignees: [
      {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        initials: "SC",
      },
      {
        name: "Mike Ross",
        avatar: "/avatars/mike.jpg",
        initials: "MR",
      },
    ],
    aiSuggestions: [
      {
        title: "Include Customer Satisfaction Trends",
        description: "Recent data shows significant improvements",
        impact: "High impact on stakeholder confidence",
      },
    ],
  },
  {
    id: "2",
    title: "Customer Feedback Integration",
    description: "Implement new feedback collection system",
    priority: "medium",
    status: "review",
    dueDate: "2025-03-25",
    progress: 90,
    tags: ["feedback", "development", "customer"],
    assignees: [
      {
        name: "Alex Kumar",
        avatar: "/avatars/alex.jpg",
        initials: "AK",
      },
    ],
  },
  {
    id: "3",
    title: "Sales Pipeline Optimization",
    description: "Analyze and optimize current sales funnel",
    priority: "high",
    status: "todo",
    dueDate: "2025-03-18",
    progress: 20,
    tags: ["sales", "optimization", "analytics"],
    assignees: [
      {
        name: "Emma Wilson",
        avatar: "/avatars/emma.jpg",
        initials: "EW",
      },
      {
        name: "John Doe",
        avatar: "/avatars/john.jpg",
        initials: "JD",
      },
    ],
    aiSuggestions: [
      {
        title: "Focus on Mid-Market Segment",
        description: "Data shows 40% higher conversion rate",
        impact: "Potential 25% revenue increase",
      },
    ],
  },
];

const taskMetrics = [
  {
    title: "Tasks Completed",
    value: "24",
    change: "+8",
    trend: "up",
  },
  {
    title: "On Track",
    value: "89%",
    change: "+5%",
    trend: "up",
  },
  {
    title: "Overdue",
    value: "3",
    change: "-2",
    trend: "down",
  },
];

export default function AdvancedTaskManager() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Task Manager</h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-enhanced task tracking and management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 text-sm gap-2 border-gray-200"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="h-9 text-sm border-gray-200">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-9 text-sm gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Task Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {taskMetrics.map((metric, index) => (
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
                  <Timer className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
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

      {/* Task List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Active Tasks
              </CardTitle>
              <CardDescription>
                Manage and track your team's tasks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          task.priority === "high"
                            ? "bg-red-50 text-red-600"
                            : task.priority === "medium"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <Flag className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Assign Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Set Due Date
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {task.progress}%
                      </span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{task.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tags className="h-4 w-4 text-gray-400" />
                    <div className="flex gap-2">
                      {task.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {task.assignees.map((assignee, index) => (
                      <Avatar
                        key={index}
                        className="border-2 border-white h-8 w-8"
                      >
                        <AvatarImage src={assignee.avatar} />
                        <AvatarFallback>{assignee.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                {task.aiSuggestions && (
                  <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600 text-sm font-medium mb-2">
                      <Brain className="h-4 w-4" />
                      AI Suggestions
                    </div>
                    {task.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {suggestion.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {suggestion.description}
                        </p>
                        <p className="text-xs font-medium text-purple-600">
                          {suggestion.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
