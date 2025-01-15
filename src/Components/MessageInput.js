import React, { useRef } from "react";
import { Box, TextField, IconButton, Menu, MenuItem } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";

const MessageInput = ({
  message,
  setMessage,
  onSendMessage,
  onOpenMenu,
  anchorEl,
  handleCloseMenu,
  createRoom,
  setRoomId,
}) => {
  const inputRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(); // Trigger the send message action
      inputRef.current?.focus(); // Refocus the input field
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent line break on Enter
      handleSendMessage();
    }
  };

  return (
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
        inputRef={inputRef}
        variant="outlined"
        placeholder="Say, Hi..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        fullWidth
        sx={{ marginRight: "10px" }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            createRoom();
            handleCloseMenu();
          }}
        >
          Create Room
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            const roomId = prompt("Enter Room ID:");
            setRoomId(roomId);
          }}
        >
          Join Room
        </MenuItem>
      </Menu>
      <IconButton onClick={onOpenMenu}>
        <CallIcon />
      </IconButton>
      <IconButton
        color="primary"
        onClick={handleSendMessage}
        sx={{
          backgroundColor: "#075E54",
          color: "white",
          "&:hover": { backgroundColor: "#056345" },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
