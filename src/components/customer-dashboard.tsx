"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Calendar,
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  Tags,
  Users,
} from "lucide-react";
import CustomerTable from "./customer-table";
import { Badge } from "./ui/badge";

const COLORS = ["#000000", "#666666", "#999999", "#cccccc"];

interface CustomerDashboardProps {
  customers: any[];
}

export default function CustomerDashboard({ customers }: CustomerDashboardProps) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [timeRange, setTimeRange] = useState("7d");

  // Calculate customer metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const inactiveCustomers = customers.filter(
    (c) => c.status === "inactive"
  ).length;
  const pendingCustomers = customers.filter((c) => c.status === "pending").length;

  // Customer type distribution data
  const customerTypeData = [
    {
      name: "Enterprise",
      value: customers.filter((c) => c.type === "enterprise").length,
    },
    {
      name: "Business",
      value: customers.filter((c) => c.type === "business").length,
    },
    {
      name: "Startup",
      value: customers.filter((c) => c.type === "startup").length,
    },
  ];

  // Customer growth data (mock data - replace with actual data)
  const growthData = [
    { name: "Jan", customers: 20 },
    { name: "Feb", customers: 35 },
    { name: "Mar", customers: 45 },
    { name: "Apr", customers: 60 },
    { name: "May", customers: 75 },
    { name: "Jun", customers: 90 },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
            <Users className="h-4 w-4 text-black" />
          </div>
          <p className="text-2xl font-bold">{totalCustomers}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 bg-green-50">
              +12%
            </Badge>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </div>
          <p className="text-2xl font-bold">{activeCustomers}</p>
          <p className="text-xs text-gray-500">
            {((activeCustomers / totalCustomers) * 100).toFixed(1)}% of total
          </p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
            <div className="h-4 w-4 rounded-full bg-gray-500" />
          </div>
          <p className="text-2xl font-bold">{inactiveCustomers}</p>
          <p className="text-xs text-gray-500">
            {((inactiveCustomers / totalCustomers) * 100).toFixed(1)}% of total
          </p>
        </Card>

        <Card className="p-6 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </div>
          <p className="text-2xl font-bold">{pendingCustomers}</p>
          <p className="text-xs text-gray-500">
            {((pendingCustomers / totalCustomers) * 100).toFixed(1)}% of total
          </p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Customer Growth</h3>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#000" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Customer Types</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {customerTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Customer List Section */}
      <Card>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer List</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <CustomerTable initialCustomers={customers} />
      </Card>
    </div>
  );
}
