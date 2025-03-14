export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: "lead" | "active" | "inactive";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  customer_id: string;
  user_id: string;
  type: "call" | "email" | "meeting" | "note";
  summary: string;
  details?: string;
  date: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  customer_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}
