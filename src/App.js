import React, { useEffect, useState } from "react";
import Login from "./Components/Login";
import ChatRoom from "./Components/ChatRoom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { CookiesProvider, useCookies } from "react-cookie";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import CallRoom from "./Components/CallRoom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1877F2", // Facebook Blue
    },
    secondary: {
      main: "#42b72a", // Facebook Green
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const App = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState(cookie.user ? cookie.user : null);

  useEffect(() => {
    console.log("cookie.user:", cookie.user);
    if (cookie.user) setUser(cookie.user);
    else setUser(null);
  }, [cookie.user]);

  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                user ? <ChatRoom user={user} /> : <Login setUser={setUser} />
              }
            />
            <Route path="/callRoom/:roomId" element={<CallRoom />} />
          </Routes>
        </Router>
      </CookiesProvider>
    </ThemeProvider>
  );
};

export default App;
