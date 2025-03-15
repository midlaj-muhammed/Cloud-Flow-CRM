import { Brain, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface Insight {
  type: "opportunity" | "alert" | "trend" | "action";
  title: string;
  description: string;
  impact?: string;
  action?: string;
  icon: JSX.Element;
  color: string;
}

const insights: Insight[] = [
  {
    type: "opportunity",
    title: "Upsell Opportunity",
    description: "5 customers are showing high engagement patterns similar to your enterprise clients.",
    impact: "Potential revenue increase: $25,000",
    action: "Review Accounts",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    type: "alert",
    title: "Churn Risk Detected",
    description: "3 customers have shown decreased activity in the last 30 days.",
    impact: "At risk revenue: $12,000",
    action: "View At-Risk Accounts",
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-red-600 bg-red-50",
  },
  {
    type: "trend",
    title: "Customer Behavior Pattern",
    description: "Users who engage with the analytics feature show 40% higher retention.",
    action: "Analyze Pattern",
    icon: <Brain className="h-5 w-5" />,
    color: "text-purple-600 bg-purple-50",
  },
  {
    type: "action",
    title: "Customer Success Opportunity",
    description: "2 new customers haven't completed onboarding after 7 days.",
    action: "Schedule Onboarding",
    icon: <Users className="h-5 w-5" />,
    color: "text-blue-600 bg-blue-50",
  },
];

export default function AIInsights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">AI Insights</h2>
          <p className="text-sm text-gray-500">
            AI-powered recommendations based on your customer data
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-sm">
          Customize Insights
        </Button>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${insight.color}`}>
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {insight.title}
                  </h3>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600">
                    {insight.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{insight.description}</p>
                {insight.impact && (
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {insight.impact}
                  </p>
                )}
                {insight.action && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-sm hover:bg-gray-50"
                  >
                    {insight.action}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Enable Advanced AI Features
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Get deeper insights with our advanced AI analysis tools
            </p>
          </div>
          <Button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
