"use client";

import { useState, useEffect } from "react";
import { Customer, Interaction } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerInsightsProps {
  customerId: string;
  customerData: Customer;
  interactionData: Interaction[];
}

export default function CustomerInsights({
  customerId,
  customerData,
  interactionData,
}: CustomerInsightsProps) {
  const [insights, setInsights] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generateInsights",
          data: { customerId },
        }),
      });

      const data = await response.json();
      if (data.insights) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "suggestTasks",
          data: { customerId },
        }),
      });

      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-medium">Customer Insights</h3>
            </div>
            <Button
              variant="outline"
              onClick={generateInsights}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Insights"
              )}
            </Button>
          </div>

          <div className="mt-4">
            {insights ? (
              <div className="whitespace-pre-line">{insights}</div>
            ) : (
              <p className="text-muted-foreground">
                Click the button to generate AI-powered insights about this
                customer based on their profile and interaction history.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Suggested Follow-ups</h3>
            </div>
            <Button
              variant="outline"
              onClick={generateSuggestions}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Suggestions"
              )}
            </Button>
          </div>

          <div className="mt-4">
            {suggestions ? (
              <div className="whitespace-pre-line">{suggestions}</div>
            ) : (
              <p className="text-muted-foreground">
                Click the button to get AI-suggested follow-up tasks based on
                this customer's profile and interaction history.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
