"use client";

import { useState } from "react";
import { Customer } from "@/types/crm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";
import { formatDistanceToNow } from "date-fns";

interface CustomerTableProps {
  initialCustomers: Customer[];
}

export default function CustomerTable({
  initialCustomers,
}: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (!error) {
        setCustomers(customers.filter((customer) => customer.id !== id));
      } else {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 ring-1 ring-green-600/20";
      case "inactive":
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
      case "pending":
        return "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-gray-50 text-sm font-medium text-gray-700">Name</TableHead>
            <TableHead className="bg-gray-50 text-sm font-medium text-gray-700">Email</TableHead>
            <TableHead className="bg-gray-50 text-sm font-medium text-gray-700">Company</TableHead>
            <TableHead className="bg-gray-50 text-sm font-medium text-gray-700">Status</TableHead>
            <TableHead className="bg-gray-50 text-sm font-medium text-gray-700">Added</TableHead>
            <TableHead className="bg-gray-50 text-sm font-medium text-gray-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No customers found. Add your first customer to get started.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-sm">{customer.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{customer.email || "-"}</TableCell>
                <TableCell className="text-sm text-gray-600">{customer.company || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${getStatusBadgeClass(
                      customer.status,
                    )}`}
                  >
                    {customer.status.charAt(0).toUpperCase() +
                      customer.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(customer.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-black transition-colors rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] p-2 border border-gray-200 shadow-lg rounded-lg bg-white">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/customers/${customer.id}`)
                        }
                        className="flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/customers/${customer.id}/edit`
                          )
                        }
                        className="flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(customer.id)}
                        className="flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
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
