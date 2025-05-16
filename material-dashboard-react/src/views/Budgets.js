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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
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
                          <TableCell>Category</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {budgets.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell>{b.category}</TableCell>
                            <TableCell>{b.amount}</TableCell>
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
                        ))}
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
