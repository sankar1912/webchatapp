import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import icon from "../logo192.png";
const Login = ({setUser}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: 2,
        borderRadius: 2,
      }}
    >
      {/* Logo */}
      <img src={icon}/>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#1877F2",
          mb: 2,
          textAlign: "center",
        }}
      >
        ChatApplication
      </Typography>

      {/* Login Form */}
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
        }}
      >
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: "#1877F2",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            ":hover": { backgroundColor: "#165cdb" },
          }}
        >
          Login
        </Button>
        <Typography
          variant="body2"
          sx={{
            color: "#1877F2",
            mt: 2,
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => alert("Redirecting to forgot password...")}
        >
          Forgotten password?
        </Typography>
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Don't have an account?
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: "#42b72a",
              textTransform: "none",
              fontWeight: "bold",
              ":hover": { backgroundColor: "#36a420" },
            }}
            onClick={() => alert("Redirecting to sign up...")}
          >
            Create New Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
