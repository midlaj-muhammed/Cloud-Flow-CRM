"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AddInteractionFormProps {
  customerId: string;
  customerName: string;
}

export default function AddInteractionForm({
  customerId,
  customerName,
}: AddInteractionFormProps) {
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [formData, setFormData] = useState({
    type: "call",
    summary: "",
    details: "",
    date: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDThh:mm
  });
  const supabase = createClient();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSummarize = async () => {
    if (!formData.details) return;

    setSummarizing(true);
    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "summarizeInteraction",
          data: { details: formData.details },
        }),
      });

      const data = await response.json();
      if (data.summary) {
        setFormData((prev) => ({ ...prev, summary: data.summary }));
      }
    } catch (error) {
      console.error("Error summarizing interaction:", error);
    } finally {
      setSummarizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("interactions").insert({
        customer_id: customerId,
        user_id: userData.user.id,
        type: formData.type,
        summary: formData.summary,
        details: formData.details,
        date: new Date(formData.date).toISOString(),
      });

      if (error) throw error;

      router.push(`/dashboard/customers/${customerId}`);
    } catch (error) {
      console.error("Error adding interaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type *
              </Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select interaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date & Time *
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="details" className="text-right pt-2">
                Details
              </Label>
              <div className="col-span-3 space-y-2">
                <Textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={5}
                  placeholder={`Enter the details of your ${formData.type} with ${customerName}...`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSummarize}
                  disabled={!formData.details || summarizing}
                >
                  {summarizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    "AI Summarize"
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="summary" className="text-right pt-2">
                Summary *
              </Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                className="col-span-3"
                rows={2}
                placeholder="Brief summary of the interaction"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/customers/${customerId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Interaction"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
