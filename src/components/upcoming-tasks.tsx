import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  customerName?: string;
}

const upcomingTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with Olivia Martin",
    dueDate: "Today, 2:00 PM",
    priority: "high",
    completed: false,
    customerName: "Olivia Martin",
  },
  {
    id: "2",
    title: "Send proposal to Jackson Lee",
    dueDate: "Today, 5:00 PM",
    priority: "medium",
    completed: false,
    customerName: "Jackson Lee",
  },
  {
    id: "3",
    title: "Schedule demo with Isabella Nguyen",
    dueDate: "Tomorrow, 10:00 AM",
    priority: "high",
    completed: false,
    customerName: "Isabella Nguyen",
  },
  {
    id: "4",
    title: "Review account status for William Kim",
    dueDate: "Tomorrow, 3:00 PM",
    priority: "low",
    completed: false,
    customerName: "William Kim",
  },
  {
    id: "5",
    title: "Prepare quarterly report",
    dueDate: "Friday, 12:00 PM",
    priority: "medium",
    completed: false,
  },
];

export default function UpcomingTasks() {
  return (
    <div className="space-y-4">
      {upcomingTasks.slice(0, 4).map((task) => (
        <div
          key={task.id}
          className="group flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <button className="flex-none">
            <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-gray-400 transition-colors">
              <CheckCircle className="h-3.5 w-3.5 text-transparent group-hover:text-gray-400 transition-colors" />
            </div>
          </button>
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-gray-900">
                {task.title}
              </p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityClasses(task.priority)}`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{task.dueDate}</span>
              {task.customerName && (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{task.customerName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {upcomingTasks.length > 4 && (
        <button className="w-full text-center py-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
          View all {upcomingTasks.length} tasks
        </button>
      )}
    </div>
  );
}

function getPriorityClasses(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700";
    case "medium":
      return "bg-amber-50 text-amber-700";
    case "low":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}
