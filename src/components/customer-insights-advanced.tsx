"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BarChart3,
  Brain,
  Clock,
  CreditCard,
  DollarSign,
  Heart,
  LineChart,
  MessageSquare,
  Rocket,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";

interface CustomerMetric {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: JSX.Element;
}

interface RecommendedAction {
  title: string;
  description: string;
  impact: string;
  priority: "high" | "medium" | "low";
  icon: JSX.Element;
}

const metrics: CustomerMetric[] = [
  {
    title: "Lifetime Value",
    value: "$12,845",
    change: "+24%",
    trend: "up",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Purchase Frequency",
    value: "2.8x/month",
    change: "+12%",
    trend: "up",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    title: "Engagement Score",
    value: 85,
    change: "+5%",
    trend: "up",
    icon: <Heart className="h-4 w-4" />,
  },
  {
    title: "Support Tickets",
    value: "4 open",
    change: "-15%",
    trend: "down",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

const recommendations: RecommendedAction[] = [
  {
    title: "Upsell Premium Features",
    description: "Customer shows high engagement with current features",
    impact: "Potential +$2,400/year",
    priority: "high",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    title: "Schedule Quarterly Review",
    description: "Last review was 3 months ago",
    impact: "Improve retention by 15%",
    priority: "medium",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Loyalty Program Upgrade",
    description: "Eligible for VIP tier based on spending",
    impact: "Increase engagement by 25%",
    priority: "high",
    icon: <Star className="h-4 w-4" />,
  },
];

const behaviorPatterns = [
  {
    title: "Usage Time",
    value: 75,
    benchmark: 60,
    label: "Above average",
  },
  {
    title: "Feature Adoption",
    value: 85,
    benchmark: 70,
    label: "Excellent",
  },
  {
    title: "Payment Reliability",
    value: 95,
    benchmark: 85,
    label: "Outstanding",
  },
];

export default function CustomerInsightsAdvanced() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30days");
  const [selectedInsightType, setSelectedInsightType] = useState("all");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Advanced Customer Insights
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered analysis and recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="h-9 text-sm border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-gray-300">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedInsightType}
            onValueChange={setSelectedInsightType}
          >
            <SelectTrigger className="h-9 text-sm border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-gray-300">
              <SelectValue placeholder="Select insight type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Insights</SelectItem>
              <SelectItem value="behavior">Behavior</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-sm transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-700">
                {metric.title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  metric.trend === "up"
                    ? "bg-emerald-50 text-emerald-600"
                    : metric.trend === "down"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <p
                className={`text-xs font-medium mt-1 ${
                  metric.trend === "up"
                    ? "text-emerald-600"
                    : metric.trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Smart suggestions based on customer data
                </CardDescription>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Brain className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((action, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      action.priority === "high"
                        ? "bg-red-50 text-red-600"
                        : action.priority === "medium"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {action.title}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          action.priority === "high"
                            ? "bg-red-50 text-red-600"
                            : action.priority === "medium"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {action.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {action.description}
                    </p>
                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      {action.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Behavior Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Behavior Analysis
                </CardTitle>
                <CardDescription>
                  Customer patterns and benchmarks
                </CardDescription>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {behaviorPatterns.map((pattern, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {pattern.title}
                    </p>
                    <span className="text-sm font-medium text-gray-900">
                      {pattern.value}%
                    </span>
                  </div>
                  <Progress value={pattern.value} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Benchmark: {pattern.benchmark}%
                    </span>
                    <span
                      className={
                        pattern.value > pattern.benchmark
                          ? "text-emerald-600 font-medium"
                          : "text-gray-500"
                      }
                    >
                      {pattern.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Predictive Analytics
              </CardTitle>
              <CardDescription>
                AI-powered forecasts and predictions
              </CardDescription>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Rocket className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Churn Probability
                </p>
                <span className="text-sm font-medium text-emerald-600">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress value={15} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-900">15%</span>
              </div>
              <p className="text-xs text-gray-500">
                Based on engagement and payment history
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Expansion Revenue
                </p>
                <span className="text-sm font-medium text-emerald-600">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress value={85} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
              <p className="text-xs text-gray-500">
                Likelihood of upgrading in next 3 months
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Support Prediction
                </p>
                <span className="text-sm font-medium text-blue-600">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress value={45} className="h-2" />
                </div>
                <span className="text-sm font-medium text-gray-900">45%</span>
              </div>
              <p className="text-xs text-gray-500">
                Probability of requiring support this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
