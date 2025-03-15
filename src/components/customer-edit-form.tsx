"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "../../supabase/client";

import { Customer } from "@/types/crm";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
  type: z.enum(["enterprise", "business", "startup"]),
  status: z.enum(["active", "inactive", "pending"]),
  tags: z.array(z.string()),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerEditFormProps {
  customer: Customer;
}

export default function CustomerEditForm({ customer }: CustomerEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email,
      company: customer.company,
      type: customer.type,
      status: customer.status,
      tags: customer.tags || [],
    },
  });

  async function onSubmit(data: CustomerFormValues) {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("customers")
        .update(data)
        .eq("id", customer.id);

      if (error) throw error;

      toast.success("Customer updated successfully");
      router.push("/dashboard/customers");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update customer");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Name
                </FormLabel>
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
                <FormLabel className="text-sm font-medium text-gray-700">
                  Email
                </FormLabel>
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

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Company
                </FormLabel>
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
                <FormLabel className="text-sm font-medium text-gray-700">
                  Customer Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
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

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Status
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-9 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormLabel className="text-sm font-medium text-gray-700">
                  Tags
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add tags (comma separated)"
                    value={field.value.join(", ")}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(",")
                        .filter(Boolean)
                        .map((tag) => tag.trim());
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-9 px-4 border-gray-200 hover:bg-gray-50 hover:text-black transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-9 px-4 bg-black text-white hover:bg-black/90 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
