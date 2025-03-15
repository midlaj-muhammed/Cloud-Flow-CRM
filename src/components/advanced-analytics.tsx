"use client";

import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Button } from "./ui/button";
import CustomerSegments from "./customer-segments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const monthlyData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Customer Growth",
      data: [65, 78, 90, 105, 125, 138],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "rgb(59, 130, 246)",
      pointBorderColor: "white",
      pointBorderWidth: 2,
      borderWidth: 2,
    },
    {
      label: "Revenue ($K)",
      data: [30, 45, 55, 60, 75, 85],
      borderColor: "rgb(16, 185, 129)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "rgb(16, 185, 129)",
      pointBorderColor: "white",
      pointBorderWidth: 2,
      borderWidth: 2,
    },
  ],
};

const conversionData = {
  labels: ["Leads", "Prospects", "Opportunities", "Negotiations", "Closed"],
  datasets: [
    {
      label: "Conversion Pipeline",
      data: [100, 75, 50, 35, 25],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(139, 92, 246, 0.8)",
        "rgba(236, 72, 153, 0.8)",
      ],
      borderWidth: 0,
      borderRadius: 4,
    },
  ],
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "rgb(17, 24, 39)",
      bodyColor: "rgb(17, 24, 39)",
      bodyFont: {
        size: 12,
      },
      titleFont: {
        size: 12,
        weight: "bold" as const,
      },
      padding: 12,
      borderColor: "rgb(229, 231, 235)",
      borderWidth: 1,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      usePointStyle: true,
      callbacks: {
        title: (context: any) => `${context[0].label}`,
        label: (context: any) => ` ${context.dataset.label}: ${context.parsed.y}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgb(243, 244, 246)",
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 12,
        },
        padding: 8,
      },
      border: {
        dash: [4, 4],
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
        padding: 8,
      },
      border: {
        dash: [4, 4],
      },
    },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "white",
      titleColor: "rgb(17, 24, 39)",
      bodyColor: "rgb(17, 24, 39)",
      bodyFont: {
        size: 12,
      },
      titleFont: {
        size: 12,
        weight: "bold" as const,
      },
      padding: 12,
      borderColor: "rgb(229, 231, 235)",
      borderWidth: 1,
      callbacks: {
        title: (context: any) => `${context[0].label}`,
        label: (context: any) => ` Count: ${context.parsed.y}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgb(243, 244, 246)",
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 12,
        },
        padding: 8,
      },
      border: {
        dash: [4, 4],
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
        padding: 8,
      },
      border: {
        dash: [4, 4],
      },
    },
  },
};

export default function AdvancedAnalytics() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">
            Comprehensive analysis and insights for data-driven decisions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="6months">
            <SelectTrigger className="h-9 text-sm border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-gray-300">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
              <SelectItem value="year">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="h-9 text-sm border-gray-200 hover:bg-gray-50"
          >
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Growth Trends</h3>
              <p className="text-xs text-gray-500 mt-1">Monthly customer and revenue growth</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-gray-50">
              View Details
            </Button>
          </div>
          <div className="h-[300px]">
            <Line data={monthlyData} options={lineChartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Sales Pipeline</h3>
              <p className="text-xs text-gray-500 mt-1">Conversion stages and progress</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-gray-50">
              View Details
            </Button>
          </div>
          <div className="h-[300px]">
            <Bar data={conversionData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
        <CustomerSegments />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Top Products</h3>
              <p className="text-xs text-gray-500 mt-1">Best performing products by revenue</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-gray-50">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { name: "Enterprise Plan", value: "$45,000", growth: "+15%", color: "emerald" },
              { name: "Business Pro", value: "$32,000", growth: "+8%", color: "blue" },
              { name: "Starter Kit", value: "$18,000", growth: "+12%", color: "purple" },
            ].map((product, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full bg-${product.color}-500`} />
                  <span className="text-sm text-gray-900">{product.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    {product.value}
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">{product.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
              <p className="text-xs text-gray-500 mt-1">Latest updates and events</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-gray-50">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {[
              {
                action: "New enterprise customer",
                time: "5 minutes ago",
                details: "Tech Solutions Inc.",
                type: "success",
              },
              {
                action: "Major deal closed",
                time: "2 hours ago",
                details: "$48,000 annual contract",
                type: "success",
              },
              {
                action: "Customer feedback received",
                time: "Yesterday",
                details: "4.8/5 satisfaction score",
                type: "info",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 border-b last:border-0"
              >
                <div 
                  className={`w-2 h-2 mt-1.5 rounded-full ${activity.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span className="truncate">{activity.details}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
