import { useState } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import InductionList from "../components/InductionList";
import { Induction } from "../types";

export default function Dashboard() {
  const [selectedInduction, setSelectedInduction] = useState<Induction | null>(null);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        <Paper sx={{ width: 280, flexShrink: 0, p: 2 }}>
          <InductionList
            selectedId={selectedInduction?.id ?? null}
            onSelect={setSelectedInduction}
          />
        </Paper>

        <Box sx={{ flex: 1 }}>
          {selectedInduction ? (
            <Typography variant="h5">{selectedInduction.name}</Typography>
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
