// src/components/Transactions.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Chip,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";
import api from "../api";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState("");
  const [salaryDescription, setSalaryDescription] = useState("Salary");
  const [salaryDate, setSalaryDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState("Expense");

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/transactions");
      setTransactions(res.data);
    } catch {
      setSnackbar({ open: true, message: "Failed to load transactions", severity: "error" });
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
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
    setEditTransactionId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      setSnackbar({ open: true, message: "All fields are required.", severity: "warning" });
      return;
    }
    let finalAmount = Number(amount);
    if (type === "Expense" && finalAmount > 0) {
      finalAmount = -finalAmount;
    }
    if (type === "Income" && finalAmount < 0) {
      finalAmount = Math.abs(finalAmount);
    }
    setLoading(true);
    try {
      if (editTransactionId) {
        await api.put(`/api/transactions/${editTransactionId}`, {
          description,
          amount: finalAmount,
          category,
          date,
        });
        setSnackbar({ open: true, message: "Transaction updated.", severity: "success" });
      } else {
        await api.post("/api/transactions", { description, amount: finalAmount, category, date });
        setSnackbar({ open: true, message: "Transaction added.", severity: "success" });
      }
      fetchTransactions();
      resetForm();
    } catch {
      setSnackbar({ open: true, message: "Error saving transaction.", severity: "error" });
    }
    setLoading(false);
  };

  const handleEdit = (t) => {
    setEditTransactionId(t.id);
    setDescription(t.description);
    setAmount(t.amount);
    setCategory(t.category);
    setDate(t.date);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/transactions/${id}`);
      setSnackbar({ open: true, message: "Transaction deleted.", severity: "success" });
      fetchTransactions();
    } catch {
      setSnackbar({ open: true, message: "Error deleting transaction.", severity: "error" });
    }
    setLoading(false);
  };

  const addTestIncome = async () => {
    try {
      await api.post("/api/transactions", {
        description: "Test Salary",
        amount: 2000,
        category:
          categories.find((c) => c.name.toLowerCase() === "income")?.name ||
          categories[0]?.name ||
          "Income",
        date: new Date().toISOString().slice(0, 10),
      });
      fetchTransactions && fetchTransactions();
      setSnackbar({
        open: true,
        message: "Test income added!",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add test income",
        severity: "error",
      });
    }
  };

  const handleSimulateSalary = async () => {
    if (!salaryAmount) {
      setSnackbar({ open: true, message: "Amount is required.", severity: "warning" });
      return;
    }
    try {
      await api.post("/api/transactions", {
        description: salaryDescription || "Salary",
        amount: Number(salaryAmount),
        category:
          categories.find((c) => c.name.toLowerCase() === "income")?.name ||
          categories[0]?.name ||
          "Income",
        date: salaryDate,
      });
      fetchTransactions && fetchTransactions();
      setSnackbar({ open: true, message: "Salary added!", severity: "success" });
      setSalaryDialogOpen(false);
      setSalaryAmount("");
      setSalaryDescription("Salary");
      setSalaryDate(new Date().toISOString().slice(0, 10));
    } catch {
      setSnackbar({ open: true, message: "Failed to add salary", severity: "error" });
    }
  };

  // Filter transactions by search and category
  const filteredTransactions = transactions.filter(
    (t) =>
      (!search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())) &&
      (!category || t.category === category)
  );

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {editTransactionId ? "Edit Transaction" : "Add Transaction"}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
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
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
                      <MenuItem value="Income">Income</MenuItem>
                      <MenuItem value="Expense">Expense</MenuItem>
                    </Select>
                  </FormControl>
                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      fullWidth
                    >
                      {editTransactionId ? "Update" : "Add"}
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
                  Transactions
                </Typography>
                <Box mb={2} display="flex" gap={2}>
                  <TextField
                    label="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="">All</MenuItem>
                      {categories.map((c) => (
                        <MenuItem key={c.id} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => setSalaryDialogOpen(true)}
                  sx={{ mb: 2, ml: 2 }}
                >
                  Simulate Salary Deposit
                </Button>
                {loading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>
                            <CategoryIcon sx={{ mr: 1, color: "#1976d2" }} />
                            Category
                          </TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTransactions.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell>{t.description}</TableCell>
                            <TableCell>
                              {Number(t.amount).toLocaleString("en-PH", {
                                style: "currency",
                                currency: "PHP",
                              })}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={t.category}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{t.date}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleEdit(t)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setTransactionToDelete(t.id);
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
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                handleDelete(transactionToDelete);
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
        {/* Simulate Salary Dialog */}
        <Dialog open={salaryDialogOpen} onClose={() => setSalaryDialogOpen(false)}>
          <DialogTitle>Simulate Salary Deposit</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              type="number"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={salaryDescription}
              onChange={(e) => setSalaryDescription(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date"
              type="date"
              value={salaryDate}
              onChange={(e) => setSalaryDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSalaryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSimulateSalary} variant="contained" color="info">
              Add Salary
            </Button>
          </DialogActions>
        </Dialog>
      </MDBox>
    </DashboardLayout>
  );
}
