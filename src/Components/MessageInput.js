import React from "react";
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
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
        onClick={onSendMessage}
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
