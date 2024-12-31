import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import icon from "../logo192.png";
import { useCookies } from "react-cookie";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["user"]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setCookie("user", userCredential.user, { path: "/" });
      console.log(cookie.user);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1c1f25, #292d33)",
        color: "#FFFFFF",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "16px",
          padding: "40px",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Logo */}
        <img src={icon} alt="Logo" style={{ width: "70px", marginBottom: "20px" }} />

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: "28px",
            letterSpacing: "1px",
            marginBottom: "20px",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Welcome Back
        </Typography>

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            label="Email Address"
            type="email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputProps={{
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                borderRadius: "8px",
              },
            }}
            InputLabelProps={{ style: { color: "#CCCCCC" } }}
            sx={{ mb: 3 }}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            InputProps={{
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                borderRadius: "8px",
              },
            }}
            InputLabelProps={{ style: { color: "#CCCCCC" } }}
            sx={{ mb: 3 }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              color: "#FFFFFF",
              fontWeight: "bold",
              padding: "12px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              ":hover": {
                background: "linear-gradient(135deg, #5e0ecc, #1b66ff)",
              },
            }}
          >
            Log In
          </Button>
          <Typography
            variant="body2"
            sx={{
              marginTop: "16px",
              color: "#CCCCCC",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => alert("Redirecting to forgot password...")}
          >
            Forgot Password?
          </Typography>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#AAAAAA", mb: 2 }}>
            Don't have an account?
          </Typography>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #00c6ff, #0072ff)",
              color: "#FFFFFF",
              fontWeight: "bold",
              padding: "10px 16px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "14px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              ":hover": {
                background: "linear-gradient(135deg, #00baff, #005ecb)",
              },
            }}
            onClick={() => alert("Redirecting to sign up...")}
          >
            Create Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
