import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, Snackbar } from "@mui/material";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", { username, email, password });
      setSnackbar({
        open: true,
        message: "Registration successful! Please sign in.",
        severity: "success",
      });
      setTimeout(() => navigate("/authentication/sign-in"), 1500);
    } catch {
      setSnackbar({ open: true, message: "Registration failed", severity: "error" });
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <CardContent>
        <Typography variant="h5" mb={2}>
          Sign Up
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Sign Up
          </Button>
        </form>
        <Button onClick={() => navigate("/authentication/sign-in")} fullWidth sx={{ mt: 2 }}>
          Already have an account? Sign In
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
