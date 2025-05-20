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
import CountUp from "react-countup";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/transactions")
      .then((res) => setTransactions(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get("/api/goals").then((res) => setGoals(res.data));
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

  const groupByMonth = (txns) => {
    return txns.reduce((acc, t) => {
      const month = t.date.slice(0, 7); // "YYYY-MM"
      if (!acc[month]) acc[month] = [];
      acc[month].push(t);
      return acc;
    }, {});
  };
  const monthlyHistory = groupByMonth(transactions);

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
                  <Typography variant="h5" className="currency-highlight">
                    <CountUp end={balance} duration={1.2} separator="," decimals={2} prefix="₱" />
                  </Typography>
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
                    <span
                      className={`currency-highlight ${totalIncome > 0 ? "positive" : "negative"}`}
                    >
                      {totalIncome.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                    </span>
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
                    <span
                      className={`currency-highlight ${totalExpense < 0 ? "positive" : "negative"}`}
                    >
                      {Math.abs(totalExpense).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </span>
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
                Monthly History
              </Typography>
              {Object.keys(monthlyHistory)
                .sort((a, b) => b.localeCompare(a))
                .slice(0, 2) // Only show the last 2 months for simplicity
                .map((month) => (
                  <Box key={month} mb={2}>
                    <Typography variant="subtitle1">{month}</Typography>
                    <List>
                      {monthlyHistory[month].map((t) => (
                        <ListItem key={t.id}>
                          <ListItemText
                            primary={`${t.description} (${t.category})`}
                            secondary={`${t.date} — ${Number(t.amount).toLocaleString("en-PH", {
                              style: "currency",
                              currency: "PHP",
                            })}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
            </CardContent>
          </Card>
          <Card sx={{ my: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Goals Progress
              </Typography>
              <List>
                {goals.map((g) => (
                  <ListItem key={g.id}>
                    <ListItemText
                      primary={g.name}
                      secondary={`Saved: ${Number(g.saved).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })} / Target: ${Number(g.target).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}`}
                    />
                  </ListItem>
                ))}
                {goals.length === 0 && (
                  <Typography color="text.secondary">No goals set.</Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
