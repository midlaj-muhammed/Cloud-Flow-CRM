import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, CheckCircle2, Clock, Users } from "lucide-react";

export default function DashboardMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Total Customers</span>
            <div className="bg-blue-100 w-8 h-8 rounded-md flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900">128</div>
            <div className="flex items-center text-sm text-green-600">
              <span className="font-medium">+14%</span>
              <span className="text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Recent Interactions</span>
            <div className="bg-purple-100 w-8 h-8 rounded-md flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900">24</div>
            <div className="text-sm text-gray-600">In the last 7 days</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Upcoming Tasks</span>
            <div className="bg-orange-100 w-8 h-8 rounded-md flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900">7</div>
            <div className="text-sm text-gray-600">Due in the next 48 hours</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Completed Tasks</span>
            <div className="bg-green-100 w-8 h-8 rounded-md flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900">32</div>
            <div className="text-sm text-gray-600">This month</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          Analytics Chart Placeholder
        </div>
      </div>
    </div>
  );
}
