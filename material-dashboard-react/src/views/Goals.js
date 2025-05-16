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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import api from "../api";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/goals");
      setGoals(res.data);
    } catch {
      setSnackbar({ open: true, message: "Failed to load goals", severity: "error" });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName("");
    setTarget("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !target) {
      setSnackbar({ open: true, message: "All fields required", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/api/goals/${editId}`, { name, target });
        setSnackbar({ open: true, message: "Goal updated", severity: "success" });
      } else {
        await api.post("/api/goals", { name, target });
        setSnackbar({ open: true, message: "Goal added", severity: "success" });
      }
      fetchGoals();
      resetForm();
    } catch {
      setSnackbar({ open: true, message: "Error saving goal", severity: "error" });
    }
    setLoading(false);
  };

  const handleEdit = (g) => {
    setEditId(g.id);
    setName(g.name);
    setTarget(g.target);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/goals/${id}`);
      setSnackbar({ open: true, message: "Goal deleted", severity: "success" });
      fetchGoals();
    } catch {
      setSnackbar({ open: true, message: "Error deleting goal", severity: "error" });
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
                  {editId ? "Edit Goal" : "Add Goal"}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Goal Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Target Amount"
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
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
                  Goals
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
                          <TableCell>Name</TableCell>
                          <TableCell>Target</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {goals.map((g) => (
                          <TableRow key={g.id}>
                            <TableCell>{g.name}</TableCell>
                            <TableCell>{g.target}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleEdit(g)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setGoalToDelete(g.id);
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
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                handleDelete(goalToDelete);
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
