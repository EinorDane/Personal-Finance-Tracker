import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Snackbar } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.jwt);
      navigate("/dashboard");
    } catch {
      setSnackbar({ open: true, message: "Login failed", severity: "error" });
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <CardContent>
        <Typography variant="h5" mb={2}>
          Sign In
        </Typography>
        <form onSubmit={handleSignIn}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        </form>
        <Button onClick={() => navigate("/authentication/sign-up")} fullWidth sx={{ mt: 2 }}>
          Don&apos;t have an account? Sign Up
        </Button>
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Card>
  );
}
