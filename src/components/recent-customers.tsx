import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Customer {
  id: string;
  name: string;
  email: string;
  lastContact: string;
  status: "active" | "inactive" | "lead";
  avatarUrl?: string;
}

const recentCustomers: Customer[] = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    lastContact: "1 hour ago",
    status: "active",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    lastContact: "3 hours ago",
    status: "lead",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    lastContact: "Yesterday",
    status: "active",
  },
  {
    id: "4",
    name: "William Kim",
    email: "william.kim@email.com",
    lastContact: "2 days ago",
    status: "inactive",
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    lastContact: "3 days ago",
    status: "active",
  },
];

export default function RecentCustomers() {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 bg-gray-100">
                      <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                      <AvatarFallback className="text-sm font-medium text-gray-900">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(customer.status)}`}
                  >
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{customer.lastContact}</span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{customer.email}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusClasses(status: Customer["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700";
    case "inactive":
      return "bg-gray-50 text-gray-700";
    case "lead":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}
