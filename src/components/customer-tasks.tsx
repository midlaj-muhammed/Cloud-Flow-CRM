"use client";

import { useState } from "react";
import { Task } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, isPast, isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "../../supabase/client";

interface CustomerTasksProps {
  customerId: string;
  initialTasks: Task[];
}

export default function CustomerTasks({
  customerId,
  initialTasks,
}: CustomerTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const router = useRouter();
  const supabase = createClient();

  const handleComplete = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: "completed" })
      .eq("id", id);

    if (!error) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: "completed" } : task,
        ),
      );
    } else {
      console.error("Error completing task:", error);
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
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
  };

  const getDueDateClass = (dueDate: string | undefined) => {
    if (!dueDate) return "";
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return "text-red-600";
    if (isToday(date)) return "text-yellow-600";
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tasks</h3>
        <Button
          onClick={() =>
            router.push(`/dashboard/tasks/add?customer=${customerId}`)
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-md border">
          <p className="text-muted-foreground">
            No tasks assigned for this customer. Add your first task.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div>
                    {task.status === "completed" ? (
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      ></button>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          {task.due_date && (
                            <p
                              className={`text-sm ${getDueDateClass(
                                task.due_date,
                              )}`}
                            >
                              Due:{" "}
                              {format(new Date(task.due_date), "MMM d, yyyy")}
                            </p>
                          )}
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(
                              task.priority,
                            )}`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {task.description && (
                      <p className="mt-2 text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
