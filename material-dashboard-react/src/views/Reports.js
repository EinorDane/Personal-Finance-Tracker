import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import { Bar, Line } from "react-chartjs-2";
import api from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    api.get("/api/transactions").then((res) => {
      setTransactions(res.data);
      setLoading(false);
    });
  }, []);

  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Total by Category",
        data: Object.values(categoryTotals),
        backgroundColor: "#42a5f5",
      },
    ],
  };

  const lineData = {
    labels: transactions.map((t) => t.date),
    datasets: [
      {
        label: "Spending Over Time",
        data: transactions.map((t) => t.amount),
        borderColor: "#66bb6a",
        fill: false,
      },
    ],
  };

  const groupByMonth = (txns) => {
    return txns.reduce((acc, t) => {
      const month = t.date.slice(0, 7); // "YYYY-MM"
      if (!acc[month]) acc[month] = [];
      acc[month].push(t);
      return acc;
    }, {});
  };
  const monthlyHistory = groupByMonth(transactions);

  const filteredMonthlyHistory = Object.fromEntries(
    Object.entries(monthlyHistory).filter(([month]) => {
      const [y, m] = month.split("-");
      return String(y) === String(selectedYear) && (selectedMonth === "" || m === selectedMonth);
    })
  );

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <Typography variant="h4" mb={3}>
          Reports
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Category Breakdown</Typography>
                  <Bar data={barData} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Spending Over Time</Typography>
                  <Line data={lineData} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ my: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Full Monthly History
                  </Typography>
                  <Box display="flex" gap={2} mb={2}>
                    <TextField
                      select
                      label="Year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      size="small"
                      sx={{ minWidth: 100 }}
                    >
                      {[...new Set(transactions.map((t) => new Date(t.date).getFullYear()))].map(
                        (year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                    <TextField
                      select
                      label="Month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                          {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  {Object.keys(filteredMonthlyHistory)
                    .sort((a, b) => b.localeCompare(a))
                    .map((month) => (
                      <Box key={month} mb={2}>
                        <Typography variant="subtitle1">{month}</Typography>
                        <List>
                          {filteredMonthlyHistory[month].map((t) => (
                            <ListItem key={t.id}>
                              <ListItemText
                                primary={`${t.description} (${t.category})`}
                                secondary={
                                  <span
                                    className={`currency-highlight ${
                                      t.amount > 0 ? "positive" : "negative"
                                    }`}
                                  >
                                    {Number(t.amount).toLocaleString("en-PH", {
                                      style: "currency",
                                      currency: "PHP",
                                    })}
                                  </span>
                                }
                              />
                              <Chip
                                label={t.category}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
}
