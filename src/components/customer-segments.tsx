"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Building2, Users, Briefcase, TrendingUp, Filter } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  count: number;
  growth: string;
  revenue: string;
  engagementScore: number;
  icon: JSX.Element;
}

const segments: Segment[] = [
  {
    id: "1",
    name: "Enterprise",
    count: 45,
    growth: "+15%",
    revenue: "$450,000",
    engagementScore: 85,
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    id: "2",
    name: "Mid-Market",
    count: 128,
    growth: "+28%",
    revenue: "$320,000",
    engagementScore: 72,
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: "3",
    name: "Small Business",
    count: 394,
    growth: "+42%",
    revenue: "$180,000",
    engagementScore: 68,
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "4",
    name: "High Growth",
    count: 67,
    growth: "+55%",
    revenue: "$275,000",
    engagementScore: 91,
    icon: <TrendingUp className="h-4 w-4" />,
  },
];

export default function CustomerSegments() {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Segments
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Analysis of customer segments and their performance
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className={`group rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
              selectedSegment === segment.id
                ? "border-black ring-1 ring-black"
                : "hover:border-gray-300"
            }`}
            onClick={() => setSelectedSegment(segment.id)}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-gray-100">
                {segment.icon}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {segment.name}
                    </h3>
                    <span className="text-sm font-medium text-emerald-600">
                      {segment.growth}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {segment.count} customers
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Revenue</span>
                      <span className="font-medium text-gray-900">
                        {segment.revenue}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Engagement Score</span>
                      <span className="font-medium text-gray-900">
                        {segment.engagementScore}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${segment.engagementScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedSegment === segment.id && (
              <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
                <button className="text-center p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-xs font-medium text-gray-900 block">
                    View Details
                  </span>
                </button>
                <button className="text-center p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-xs font-medium text-gray-900 block">
                    Export Data
                  </span>
                </button>
                <button className="text-center p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-xs font-medium text-gray-900 block">
                    Create Campaign
                  </span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900">
              Segment Optimization
            </h3>
            <p className="text-sm text-gray-500">
              AI-powered suggestions to optimize your customer segments
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            View Suggestions
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {[
            "Create a new segment for customers with high support usage",
            "Split Mid-Market segment based on industry verticals",
            "Merge low-engagement segments for focused retention efforts",
          ].map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
