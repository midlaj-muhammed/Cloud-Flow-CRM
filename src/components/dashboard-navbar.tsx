"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  BarChart3,
  ClipboardList,
  Home,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "./theme-switcher";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold text-blue-600">
            CloudFlow CRM
          </Link>
          <div className="hidden md:flex items-center space-x-4 ml-8">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/dashboard/tasks"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 py-2"
            >
              <ClipboardList className="h-4 w-4" />
              Tasks
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/" className="flex w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="#" className="flex w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
