"use client";

import { useState } from "react";
import { Task } from "@/types/crm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { format, isPast, isToday } from "date-fns";

interface TaskWithCustomer extends Task {
  customers?: {
    name: string;
  } | null;
}

interface TaskTableProps {
  initialTasks: TaskWithCustomer[];
}

export default function TaskTable({ initialTasks }: TaskTableProps) {
  const [tasks, setTasks] = useState<TaskWithCustomer[]>(initialTasks);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const { error } = await supabase.from("tasks").delete().eq("id", id);

      if (!error) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleComplete = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: "done" })
      .eq("id", id);

    if (!error) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: "done" } : task,
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
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
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No tasks found. Add your first task to get started.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.customers?.name || "-"}</TableCell>
                <TableCell className={getDueDateClass(task.due_date)}>
                  {task.due_date
                    ? new Date(task.due_date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(
                      task.priority,
                    )}`}
                  >
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                      task.status,
                    )}`}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {task.status !== "done" && (
                        <DropdownMenuItem
                          onClick={() => handleComplete(task.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Done
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/tasks/${task.id}/edit`)
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
