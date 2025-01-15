import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCookies } from "react-cookie";
import { ref, onValue, db } from "../firebase";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MessageInput from "./MessageInput";
import { Download } from "@mui/icons-material";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [cookie, , removeCookie] = useCookies(["user"]);
  const messageEndRef = useRef(null);

  const otherUser =
    user.email === "ksankar1912@gmail.com"
      ? "ksankar1912@outlook.com"
      : "ksankar1912@gmail.com";

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    const messagesRef = ref(db, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = [];
      for (let key in data) {
        if (
          data[key].sender === user.email ||
          data[key].receiver === user.email
        ) {
          messagesArray.push({ id: key, ...data[key] });
        }
      }
      messagesArray.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [user.email]);

  const handleLogout = () => {
    removeCookie("user", { path: "/" });
    window.location.href = "/";
  };

  const renderMessageContent = (msg) => {
    // If the message contains a file (image), display the image
    if (msg.file) {
      return (
        <>
        <Box
          component="img"
          src={msg.file}
          alt="file attachment"
          sx={{
            maxWidth: "100%",
            borderRadius: "10px",
            marginTop: "10px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        />
        <a href={msg.file} download ><Download style={{cursor:'pointer'}} /> </a>
        </>
      );
    }

    // If it's a text message, display the text
    return <Typography>{msg.message}</Typography>;
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
        <Typography variant="h6">Chat Room</Typography>
        <LogoutIcon
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
          aria-label="Logout"
        />
      </Box>

      {/* Chat Messages */}
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
          {messages.map((msg) => {
            const messageDate = new Date(msg.timestamp).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            return (
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
                    maxWidth: "100%",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  {renderMessageContent(msg)} {/* Render message content */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      marginTop: "5px",
                      color: "gray",
                      textAlign: msg.sender === user.email ? "right" : "left",
                    }}
                  >
                    {messageDate}{" "}
                    <AccountCircleOutlinedIcon
                      sx={{
                        paddingBlockStart: "10px",
                        position: "relative",
                        top: "2px",
                      }}
                    />
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
          <div ref={messageEndRef} />
        </List>
      </Paper>

      {/* Message Input */}
      <MessageInput user={user} otherUser={otherUser} />
    </Box>
  );
};

export default ChatRoom;
