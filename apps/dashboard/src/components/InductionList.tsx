import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Induction } from "../types";

const GATEWAY = "http://localhost:8551";

interface Props {
  selectedId: string | null;
  onSelect: (induction: Induction) => void;
}

export default function InductionList({ selectedId, onSelect }: Props) {
  const [inductions, setInductions] = useState<Induction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${GATEWAY}/inductions`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load inductions");
        return res.json();
      })
      .then(setInductions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2, pb: 1 }}>
        INDUCTIONS
      </Typography>
      <List disablePadding>
        {inductions.map((induction) => (
          <ListItemButton
            key={induction.id}
            selected={induction.id === selectedId}
            onClick={() => onSelect(induction)}
            sx={{ borderRadius: 1, mb: 0.5 }}
          >
            <ListItemText primary={induction.name} />
            {induction.pending_count > 0 && (
              <Chip
                label={induction.pending_count}
                size="small"
                color="warning"
                sx={{ ml: 1, fontWeight: 600 }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
