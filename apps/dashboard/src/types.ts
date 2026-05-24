export interface Induction {
  id: string;
  name: string;
  pending_count: number;
  created_at: string;
  updated_at: string;
}

export interface InductionRecord {
  id: string;
  induction_id: string;
  first_name: string;
  last_name: string;
  company_id: string;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  induction_id: string;
  sort_column: string;
  sort_direction: "asc" | "desc";
  status_filter: "pending" | "in_progress" | "completed" | null;
}
