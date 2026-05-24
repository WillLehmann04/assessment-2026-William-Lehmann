export interface UserPreference {
  id: string;
  user_id: string;
  induction_id: string;
  sort_column: string;
  sort_direction: "asc" | "desc";
  status_filter: "pending" | "in_progress" | "completed" | null;
  created_at: Date;
  updated_at: Date;
}
