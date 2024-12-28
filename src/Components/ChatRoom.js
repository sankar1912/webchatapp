import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { db, ref, push, onValue, set } from "../firebase";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const otherUser =
    user.email === "ksankar1912@gmail.com"
      ? "ksankar1912@outlook.com"
      : "ksankar1912@gmail.com";

  useEffect(() => {
    const messagesRef = ref(db, "messages");

    // Listen for changes in the messages node
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = [];
      for (let key in data) {
        if (
          data[key].sender === user.email ||
          data[key].receiver === user.email
        ) {
          messagesArray.push({
            id: key,
            ...data[key],
          });
        }
      }
      messagesArray.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(messagesArray);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [user.email]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const messagesRef = ref(db, "messages");
    const newMessageRef = push(messagesRef);
    const timestamp = new Date().getTime();

    try {
      await set(newMessageRef, {
        sender: user.email,
        receiver: otherUser,
        message: message,
        timestamp: timestamp,
      });
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      alert("Failed to send message: " + error.message);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: "#f0f2f5",
        height: "100vh",
        padding: "20px",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#075E54",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px 10px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">
          Chat with {otherUser==="ksankar1912@gmail.com"? "Oviya":"Sankar"}
        </Typography>
      </Box>

      {/* Messages */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "10px",
        }}
      >
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender === user.email ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  backgroundColor:
                    msg.sender === user.email ? "#DCF8C6" : "#FFF",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  maxWidth: "60%",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Typography>{msg.message}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Input Area */}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "0 0 10px 10px",
          padding: "10px",
          boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          sx={{ marginRight: "10px" }}
        />
        <IconButton
          color="primary"
          onClick={sendMessage}
          sx={{
            backgroundColor: "#075E54",
            color: "white",
            "&:hover": { backgroundColor: "#056345" },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatRoom;
