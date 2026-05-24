import { useEffect, useRef, useState } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import InductionList from "../components/InductionList";
import InductionRecords from "../components/InductionRecords";
import { Induction, InductionRecord, UserPreference } from "../types";

const GATEWAY = "http://localhost:8551";
type SortColumn = "first_name" | "last_name" | "company_name" | "status" | "created_at";

export default function Dashboard() {
  const [selectedInduction, setSelectedInduction] = useState<Induction | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<InductionRecord["status"] | "">("");

  // Prevents saving during the reset-to-defaults + preference-load phase when
  // switching inductions. Set false on induction change, true once prefs are fetched.
  const prefsLoaded = useRef(false);

  const handleSelectInduction = (induction: Induction) => {
    prefsLoaded.current = false;
    setSelectedInduction(induction);
    setSortColumn("created_at");
    setSortDirection("desc");
    setStatusFilter("");
  };

  // Load preferences whenever the selected induction changes
  useEffect(() => {
    if (!selectedInduction) return;

    fetch(`${GATEWAY}/preferences/${selectedInduction.id}`)
      .then((r) => r.json())
      .then((pref: UserPreference | null) => {
        if (!pref) return;
        setSortColumn(pref.sort_column as SortColumn);
        setSortDirection(pref.sort_direction);
        setStatusFilter(pref.status_filter ?? "");
      })
      .catch(() => {})
      .finally(() => {
        prefsLoaded.current = true;
      });
  }, [selectedInduction?.id]);

  // Persist sort/filter whenever they change, but only after prefs have loaded
  useEffect(() => {
    if (!selectedInduction || !prefsLoaded.current) return;

    fetch(`${GATEWAY}/preferences/${selectedInduction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sort_column: sortColumn,
        sort_direction: sortDirection,
        status_filter: statusFilter || null,
      }),
    }).catch(() => {});
  }, [sortColumn, sortDirection, statusFilter]);

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
