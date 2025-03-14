"use client";

import { useState } from "react";
import { Interaction } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerInteractionsProps {
  customerId: string;
  initialInteractions: Interaction[];
}

export default function CustomerInteractions({
  customerId,
  initialInteractions,
}: CustomerInteractionsProps) {
  const [interactions] = useState<Interaction[]>(initialInteractions);
  const router = useRouter();

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "call":
        return "📞";
      case "email":
        return "📧";
      case "meeting":
        return "👥";
      case "note":
        return "📝";
      default:
        return "💬";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Interaction History</h3>
        <Button
          onClick={() =>
            router.push(`/dashboard/customers/${customerId}/add-interaction`)
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Log Interaction
        </Button>
      </div>

      {interactions.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-md border">
          <p className="text-muted-foreground">
            No interactions recorded yet. Log your first interaction with this
            customer.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction) => (
            <Card key={interaction.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">
                    {getInteractionIcon(interaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {interaction.type.charAt(0).toUpperCase() +
                            interaction.type.slice(1)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(interaction.date),
                            "MMM d, yyyy h:mm a",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium">{interaction.summary}</p>
                      {interaction.details && (
                        <p className="mt-2 text-muted-foreground whitespace-pre-line">
                          {interaction.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
