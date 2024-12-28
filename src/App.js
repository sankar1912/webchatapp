import React, { useState } from "react";
import Login from "./Components/Login";
import ChatRoom from "./Components/ChatRoom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

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
  const [user, setUser] = useState(null);

  return  <ThemeProvider theme={theme}>

    <CssBaseline />
    <div>{user ? <ChatRoom user={user} /> : <Login setUser={setUser} />}</div>

  </ThemeProvider>;
};

export default App;
