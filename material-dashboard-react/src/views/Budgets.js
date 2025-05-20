import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import api from "../api";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
    fetchTransactions();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/budgets");
      setBudgets(res.data);
    } catch {
      setSnackbar({ open: true, message: "Failed to load budgets", severity: "error" });
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch {
      setSnackbar({ open: true, message: "Failed to load categories", severity: "error" });
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/api/transactions");
      setTransactions(res.data);
      // Calculate total income (sum of positive amounts)
      const income = res.data
        .filter((t) => Number(t.amount) > 0)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      setTotalIncome(income);
    } catch {
      // Optionally handle error
    }
  };

  const resetForm = () => {
    setCategory("");
    setAmount("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !amount) {
      setSnackbar({ open: true, message: "All fields required", severity: "warning" });
      return;
    }
    setLoading(true);
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
    const availableIncome = totalIncome - (editId ? totalBudget - Number(amount) : totalBudget);

    if (Number(amount) > availableIncome) {
      setSnackbar({
        open: true,
        message: "Total budgets cannot exceed total income.",
        severity: "error",
      });
      setLoading(false);
      return;
    }
    try {
      if (editId) {
        await api.put(`/api/budgets/${editId}`, { category, amount });
        setSnackbar({ open: true, message: "Budget updated", severity: "success" });
      } else {
        await api.post("/api/budgets", { category, amount });
        setSnackbar({ open: true, message: "Budget added", severity: "success" });
      }
      fetchBudgets();
      resetForm();
    } catch {
      setSnackbar({ open: true, message: "Error saving budget", severity: "error" });
    }
    setLoading(false);
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setCategory(b.category);
    setAmount(b.amount);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/budgets/${id}`);
      setSnackbar({ open: true, message: "Budget deleted", severity: "success" });
      fetchBudgets();
    } catch {
      setSnackbar({ open: true, message: "Error deleting budget", severity: "error" });
    }
    setLoading(false);
  };

  const getSpentForCategory = (cat) =>
    transactions
      .filter((t) => t.category === cat && Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {editId ? "Edit Budget" : "Add Budget"}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Category"
                    >
                      {categories.map((c) => (
                        <MenuItem key={c.id} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Budget Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      fullWidth
                    >
                      {editId ? "Update" : "Add"}
                    </Button>
                    <Button onClick={resetForm} variant="outlined" color="secondary" fullWidth>
                      Reset
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Budgets
                </Typography>
                {loading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <CategoryIcon sx={{ mr: 1, color: "#1976d2" }} />
                            Category
                          </TableCell>
                          <TableCell>Budgeted</TableCell>
                          <TableCell>Spent</TableCell>
                          <TableCell>Left</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {budgets.map((b) => {
                          const spent = getSpentForCategory(b.category);
                          const left = Number(b.amount) - spent;
                          return (
                            <TableRow key={b.id}>
                              <TableCell>
                                <Chip
                                  label={b.category}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`currency-highlight ${
                                    amount > 0 ? "positive" : "negative"
                                  }`}
                                >
                                  {Number(b.amount).toLocaleString("en-PH", {
                                    style: "currency",
                                    currency: "PHP",
                                  })}
                                </span>
                              </TableCell>
                              <TableCell>
                                {spent.toLocaleString("en-PH", {
                                  style: "currency",
                                  currency: "PHP",
                                })}
                              </TableCell>
                              <TableCell>
                                {left.toLocaleString("en-PH", {
                                  style: "currency",
                                  currency: "PHP",
                                })}
                              </TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleEdit(b)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => {
                                    setBudgetToDelete(b.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this budget? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                handleDelete(budgetToDelete);
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </MDBox>
    </DashboardLayout>
  );
}
