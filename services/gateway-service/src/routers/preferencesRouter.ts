import { Router } from "express";
import { pool } from "../db";

const router = Router();
const HARDCODED_USER_ID = "hardcoded-user-id";

router.get("/:inductionId", async (req, res) => {
  try {
    const { inductionId } = req.params;
    const result = await pool.query(
      "SELECT * FROM user_preferences WHERE user_id = $1 AND induction_id = $2",
      [HARDCODED_USER_ID, inductionId]
    );
    res.json(result.rows[0] ?? null);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
});

router.put("/:inductionId", async (req, res) => {
  try {
    const { inductionId } = req.params;
    const { sort_column, sort_direction, status_filter } = req.body;
    const result = await pool.query(
      `INSERT INTO user_preferences (user_id, induction_id, sort_column, sort_direction, status_filter)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, induction_id) DO UPDATE
         SET sort_column     = EXCLUDED.sort_column,
             sort_direction  = EXCLUDED.sort_direction,
             status_filter   = EXCLUDED.status_filter,
             updated_at      = CURRENT_TIMESTAMP
       RETURNING *`,
      [HARDCODED_USER_ID, inductionId, sort_column, sort_direction, status_filter ?? null]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

export default router;
