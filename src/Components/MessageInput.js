import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ref, push, set, db } from "../firebase";

const MessageInput = ({ user, otherUser }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview when file is selected
      };
      reader.readAsDataURL(selectedFile); // Read the file as base64 to preview
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !file) return;

    const messagesRef = ref(db, "messages");
    const newMessageRef = push(messagesRef);
    const timestamp = new Date().getTime();

    try {
      const messageData = {
        sender: user.email,
        receiver: otherUser,
        message: message.trim(),
        timestamp: timestamp,
      };

      // If there's a file, convert it to base64 and store it as a Blob
      if (file) {
        const base64File = await convertFileToBase64(file); // Convert file to base64
        messageData.file = base64File; // Store the base64 file in the message data
        setFile(null); // Reset the file after sending
        setImagePreview(null); // Clear the image preview after sending
      }

      await set(newMessageRef, messageData);
      setMessage(""); // Clear the message input after sending
    } catch (error) {
      alert("Failed to send message: " + error.message);
    }
  };

  // Convert file to base64 string (Blob)
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Get the base64 string
      reader.onerror = reject; // Handle errors
      reader.readAsDataURL(file); // Read the file as base64
    });
  };

  // Handle "Enter" key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in message input
      sendMessage(); // Send the message
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        width: "100%",
        padding: "10px",
        background: "rgba(255,255,255,0.8)",
        borderTop: "1px solid #ddd",
      }}
    >
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <Tooltip title="Attach File">
          <IconButton color="primary" component="span">
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
      </label>

      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        variant="outlined"
        onKeyDown={handleKeyDown} // Add the keydown handler
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Send">
                <IconButton color="primary" onClick={sendMessage}>
                  <SendIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      {/* Show image preview if a file is selected */}
      {imagePreview && (
        <Box
          sx={{
            marginLeft: "10px",
            width: "50px",
            height: "50px",
            overflow: "hidden",
            borderRadius: "8px",
          }}
        >
          <img
            src={imagePreview}
            alt="Selected"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            
          />
        </Box>
      )}
    </Box>
  );
};

export default MessageInput;
