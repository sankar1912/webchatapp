import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  TextField,
  IconButton,
} from "@mui/material";
import { db, ref, push, onValue, set } from "../firebase";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCookies } from "react-cookie";
import { doc, updateDoc } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useNavigate } from "react-router-dom";
import MessageInput from "./MessageInput";

const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [cookie, , removeCookie] = useCookies(["user"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();
  const otherUser =
    user.email === "ksankar1912@gmail.com"
      ? "ksankar1912@outlook.com"
      : "ksankar1912@gmail.com";

  // Reference to the bottom of the chat
  const messageEndRef = useRef(null);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const updateNickname = async () => {
    if (!newNickname.trim() || !userDetails) return;

    try {
      const userDocRef = doc(db, "users", userDetails.id);
      await updateDoc(userDocRef, { nickname: newNickname });
      setUserDetails({ ...userDetails, nickname: newNickname });
      setEditingNickname(false);
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

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
      setMessage("");
    } catch (error) {
      alert("Failed to send message: " + error.message);
    }
  };

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

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

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
        {editingNickname ? (
          <Box display="flex" alignItems="center">
            <TextField
              variant="outlined"
              placeholder="Enter new name"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              size="small"
              sx={{ backgroundColor: "white", borderRadius: "5px" }}
            />
            <IconButton
              color="primary"
              onClick={updateNickname}
              sx={{ marginLeft: "10px" }}
            >
              <CheckCircleOutlinedIcon style={{ color: "green" }} />
            </IconButton>
          </Box>
        ) : (
          <Typography variant="h8">
            Chat with {userDetails?.nickname || "User"}
            <IconButton
              onClick={() => setEditingNickname(true)}
              sx={{ cursor: "pointer" }}
            >
              <EditIcon />
            </IconButton>
          </Typography>
        )}
        <LogoutIcon
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
          aria-label="Logout"
        />
      </Box>

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
                  <Typography>{msg.message}</Typography>
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
                      sx={{ paddingBlockStart: "10px", position: "relative", top: "2px" }}
                    />
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
          {/* Invisible div to track the end of the chat */}
          <div ref={messageEndRef} />
        </List>
      </Paper>

      <MessageInput
        message={message}
        setMessage={setMessage}
        onSendMessage={sendMessage}
        onOpenMenu={handleOpenMenu}
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        createRoom={() => console.log("Room created")}
        setRoomId={setRoomId}
      />
    </Box>
  );
};

export default ChatRoom;
