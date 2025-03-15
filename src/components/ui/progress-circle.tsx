"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressCircle({
  value,
  max,
  size = 40,
  strokeWidth = 4,
  className,
  ...props
}: ProgressCircleProps) {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          className="text-gray-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
