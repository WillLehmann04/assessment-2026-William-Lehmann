import { Router } from "express";

const router = Router();
const INDUCTION_URL =
  process.env.INDUCTION_SERVICE_URL || "http://localhost:8552";

router.get("/", async (_req, res) => {
  try {
    const [inductionsRes, recordsRes] = await Promise.all([
      fetch(`${INDUCTION_URL}/induction`),
      fetch(`${INDUCTION_URL}/induction/records/all`),
    ]);

    if (!inductionsRes.ok || !recordsRes.ok) {
      res.status(502).json({ error: "Upstream service error" });
      return;
    }

    const inductions: any[] = await inductionsRes.json();
    const records: any[] = await recordsRes.json();

    const pendingCounts = records.reduce<Record<string, number>>((acc, r) => {
      if (r.status === "pending") {
        acc[r.induction_id] = (acc[r.induction_id] || 0) + 1;
      }
      return acc;
    }, {});

    res.json(
      inductions.map((i) => ({ ...i, pending_count: pendingCounts[i.id] || 0 }))
    );
  } catch (error) {
    console.error("Error fetching inductions:", error);
    res.status(500).json({ error: "Failed to fetch inductions" });
  }
});

router.get("/:id/records", async (req, res) => {
  try {
    const { id } = req.params;
    const qs = new URLSearchParams(req.query as Record<string, string>).toString();
    const url = `${INDUCTION_URL}/induction/${id}/records${qs ? `?${qs}` : ""}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching induction records:", error);
    res.status(500).json({ error: "Failed to fetch induction records" });
  }
});

export default router;
