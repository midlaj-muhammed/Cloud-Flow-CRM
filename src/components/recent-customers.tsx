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
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>
          Your most recently contacted customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                <AvatarFallback className="bg-primary/10">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {customer.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customer.email}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <span className="text-xs text-muted-foreground">
                  {customer.lastContact}
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(customer.status)}`}
                  >
                    {customer.status.charAt(0).toUpperCase() +
                      customer.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusClasses(status: Customer["status"]) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case "lead":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
