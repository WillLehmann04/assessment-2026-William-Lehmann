import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Company, Induction, InductionRecord } from "../types";

const GATEWAY = "http://localhost:8551";

interface EnrichedRecord extends InductionRecord {
  company_name: string;
}

type SortColumn = "first_name" | "last_name" | "company_name" | "status" | "created_at";

const STATUS_CHIP: Record<
  InductionRecord["status"],
  { label: string; color: "warning" | "info" | "success" }
> = {
  pending: { label: "Pending", color: "warning" },
  in_progress: { label: "In Progress", color: "info" },
  completed: { label: "Completed", color: "success" },
};

const COLUMNS: { key: SortColumn; label: string }[] = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "company_name", label: "Company" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Date" },
];

interface Props {
  induction: Induction;
  sortColumn: SortColumn;
  sortDirection: "asc" | "desc";
  statusFilter: InductionRecord["status"] | "";
  onSortChange: (column: SortColumn, direction: "asc" | "desc") => void;
  onStatusFilterChange: (status: InductionRecord["status"] | "") => void;
}

export default function InductionRecords({
  induction,
  sortColumn,
  sortDirection,
  statusFilter,
  onSortChange,
  onStatusFilterChange,
}: Props) {
  const [records, setRecords] = useState<EnrichedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSearchQuery("");

    Promise.all([
      fetch(`${GATEWAY}/inductions/${induction.id}/records`).then((r) => {
        if (!r.ok) throw new Error("Failed to load records");
        return r.json() as Promise<InductionRecord[]>;
      }),
      fetch(`${GATEWAY}/companies`).then((r) => {
        if (!r.ok) throw new Error("Failed to load companies");
        return r.json() as Promise<Company[]>;
      }),
    ])
      .then(([rawRecords, companies]) => {
        const companyById = new Map(companies.map((c) => [c.id, c.name]));
        setRecords(
          rawRecords.map((rec) => ({
            ...rec,
            company_name: companyById.get(rec.company_id) ?? "Unknown",
          }))
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [induction.id]);

  const displayedRecords = useMemo(() => {
    let result = records;

    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.first_name.toLowerCase().includes(q) ||
          r.last_name.toLowerCase().includes(q) ||
          r.company_name.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      const cmp = String(a[sortColumn]).localeCompare(String(b[sortColumn]));
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [records, sortColumn, sortDirection, statusFilter, searchQuery]);

  const handleSortClick = (column: SortColumn) => {
    if (column === sortColumn) {
      onSortChange(column, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSortChange(column, "asc");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {induction.name}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by name or company…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as InductionRecord["status"] | "")
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell key={col.key} sortDirection={sortColumn === col.key ? sortDirection : false}>
                  <TableSortLabel
                    active={sortColumn === col.key}
                    direction={sortColumn === col.key ? sortDirection : "asc"}
                    onClick={() => handleSortClick(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No records match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              displayedRecords.map((rec) => {
                const chip = STATUS_CHIP[rec.status];
                return (
                  <TableRow key={rec.id} hover>
                    <TableCell>{rec.first_name}</TableCell>
                    <TableCell>{rec.last_name}</TableCell>
                    <TableCell>{rec.company_name}</TableCell>
                    <TableCell>
                      <Chip label={chip.label} color={chip.color} size="small" />
                    </TableCell>
                    <TableCell>
                      {new Date(rec.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        {displayedRecords.length} of {records.length} records
      </Typography>
    </Box>
  );
}
