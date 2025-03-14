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
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Tasks due in the next 48 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTasks.slice(0, 4).map((task) => (
            <div key={task.id} className="flex items-start space-x-4">
              <div className="mt-0.5">
                <button className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{task.title}</p>
                <div className="flex items-center pt-2">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {task.dueDate}
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityClasses(task.priority)}`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
        {upcomingTasks.length > 4 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all {upcomingTasks.length} tasks
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getPriorityClasses(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
