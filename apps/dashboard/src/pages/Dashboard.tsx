import { useState } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import InductionList from "../components/InductionList";
import InductionRecords from "../components/InductionRecords";
import { Induction, InductionRecord } from "../types";

type SortColumn = "first_name" | "last_name" | "company_name" | "status" | "created_at";

export default function Dashboard() {
  const [selectedInduction, setSelectedInduction] = useState<Induction | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<InductionRecord["status"] | "">("");

  const handleSelectInduction = (induction: Induction) => {
    setSelectedInduction(induction);
    setSortColumn("created_at");
    setSortDirection("desc");
    setStatusFilter("");
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <Paper sx={{ width: 280, flexShrink: 0, p: 2 }}>
          <InductionList
            selectedId={selectedInduction?.id ?? null}
            onSelect={handleSelectInduction}
          />
        </Paper>

        <Box sx={{ flex: 1 }}>
          {selectedInduction ? (
            <InductionRecords
              induction={selectedInduction}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              statusFilter={statusFilter}
              onSortChange={(col, dir) => { setSortColumn(col); setSortDirection(dir); }}
              onStatusFilterChange={setStatusFilter}
            />
          ) : (
            <Typography color="text.secondary">
              Select an induction to view records.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
