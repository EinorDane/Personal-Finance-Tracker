import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
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
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
}
