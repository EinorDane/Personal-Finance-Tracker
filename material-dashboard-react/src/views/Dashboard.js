import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Line } from "react-chartjs-2";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/transactions")
      .then((res) => setTransactions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome + totalExpense;

  const recentTransactions = transactions.slice(-5).reverse();

  const chartData = {
    labels: transactions.map((t) => t.date),
    datasets: [
      {
        label: "Net Amount",
        data: transactions.map((t) => t.amount),
        borderColor: "#547792",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3, ml: "250px" }}>
      <Typography variant="h4" color="text.primary" gutterBottom>
        <DashboardIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Dashboard
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: "#e3f2fd" }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    <AccountBalanceWalletIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Balance
                  </Typography>
                  <Typography variant="h5">${balance.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: "#e8f5e9" }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Income
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    ${totalIncome.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: "#ffebee" }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    <TrendingDownIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Expenses
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    ${Math.abs(totalExpense).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <List>
                {recentTransactions.map((t) => (
                  <React.Fragment key={t.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${t.description} (${t.category})`}
                        secondary={`${t.date} — $${t.amount}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {recentTransactions.length === 0 && (
                  <Typography color="text.secondary">No transactions yet.</Typography>
                )}
              </List>
            </CardContent>
          </Card>
          <Card sx={{ my: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Spending Trend
              </Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
