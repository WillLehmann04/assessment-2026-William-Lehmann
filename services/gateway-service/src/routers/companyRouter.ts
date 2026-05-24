import { Router } from "express";

const router = Router();
const COMPANY_URL = process.env.COMPANY_SERVICE_URL || "http://localhost:8553";

router.get("/", async (_req, res) => {
  try {
    const response = await fetch(`${COMPANY_URL}/company`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

export default router;
