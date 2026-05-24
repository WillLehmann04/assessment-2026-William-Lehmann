import express from "express";
import cors from "cors";
import inductionRouter from "./routers/inductionRouter";
import companyRouter from "./routers/companyRouter";
import preferencesRouter from "./routers/preferencesRouter";

const app = express();
const PORT = process.env.PORT || 8551;

app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gateway-service" });
});

app.use("/inductions", inductionRouter);
app.use("/companies", companyRouter);
app.use("/preferences", preferencesRouter);

app.listen(PORT, () => {
  console.log(`Gateway service running on port ${PORT}`);
});
