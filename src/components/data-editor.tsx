"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Customer, Task } from "@/types/crm";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Calendar,
  Edit2,
  Flag,
  MoreVertical,
  Plus,
  Tags,
  Trash2,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

// Form schemas with strict typing
const customerSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  type: z.enum(["enterprise", "business", "startup"]),
  status: z.enum(["active", "inactive", "pending"]),
  tags: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
});

const taskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  customer_id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  due_date: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  tags: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
});

type CustomerFormData = z.infer<typeof customerSchema>;
type TaskFormData = z.infer<typeof taskSchema>;

interface DataEditorProps {
  type: "customer" | "task";
  data: Customer | Task;
  onSave: (data: Customer | Task) => void;
  onDelete: (id: string) => void;
}

function CustomerForm({ data, onSave }: { data: Customer; onSave: (data: Customer) => void }) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: data,
  });

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Company</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Customer Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 text-sm border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="h-9 text-sm border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Tags</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Add tags (comma separated)"
                  value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                  onChange={(e) => {
                    const tags = e.target.value.split(",").filter(Boolean).map((tag) => tag.trim());
                    field.onChange(tags);
                  }}
                  className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Enter tags separated by commas
              </FormDescription>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}

function TaskForm({ data, onSave }: { data: Task; onSave: (data: Task) => void }) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: data,
  });

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px] text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 text-sm border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-gray-300">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-9 text-sm border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Due Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Tags</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Add tags (comma separated)"
                  value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                  onChange={(e) => {
                    const tags = e.target.value.split(",").filter(Boolean).map((tag) => tag.trim());
                    field.onChange(tags);
                  }}
                  className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Enter tags separated by commas
              </FormDescription>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}

export default function DataEditor({
  type,
  data,
  onSave,
  onDelete,
}: DataEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = (formData: Customer | Task) => {
    const processedData = {
      ...formData,
      id: data.id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: new Date().toISOString(),
      tags: Array.isArray(formData.tags) ? formData.tags : [formData.tags].filter(Boolean),
    };
    onSave(processedData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(data.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-4">
      {type === "customer" ? (
        <CustomerForm data={data as Customer} onSave={handleSave} />
      ) : (
        <TaskForm data={data as Task} onSave={handleSave} />
      )}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-black/90 transition-colors"
          onClick={() => handleSave(data)}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
