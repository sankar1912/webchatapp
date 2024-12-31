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
  MenuItem,
  Menu,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import { db, ref, push, onValue, set,fsdb } from "../firebase";
import LogoutIcon from '@mui/icons-material/Logout';
import { useCookies } from "react-cookie";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CallIcon from "@mui/icons-material/Call";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CallRoom from "./CallRoom";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For generating unique room IDs
const ChatRoom = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState('');
  const [editingNickname,setEditingNickname]=useState(false);
  const [newNickname, setNewNickname] = useState("");
  const[cookie,setCookie,removeCookie]=useCookies('user');
  const[roomId,setroomId]=useState('');  

  // Additional hooks and functions (messages, nickname editing, etc.) ...
  
  

  
  const navigation=useNavigate();
  const otherUser =
    user.email === "ksankar1912@gmail.com"
      ? "ksankar1912@outlook.com"
      : "ksankar1912@gmail.com";
      const updateNickname = async () => {
        if (!newNickname.trim() || !userDetails) return;
    
        try {
          const userDocRef = doc(fsdb, "users", userDetails.id);
          await updateDoc(userDocRef, { nickname: newNickname });
          setUserDetails({ ...userDetails, nickname: newNickname });
          setEditingNickname(false); // Exit edit mode
        } catch (error) {
          console.error("Error updating nickname:", error);
        }
      };
      const [isRoomValid, setIsRoomValid] = useState(false);

      useEffect(() => {
        const validateRoom = async () => {
          if (!roomId) return;
    
          try {
            const roomDocRef = doc(fsdb, "rooms", roomId);
            const roomDoc = await getDoc(roomDocRef);
    
            if (roomDoc.exists()) {
              setIsRoomValid(true);
              navigation(`/callRoom/${roomId}`)
            } else {
              alert("Invalid Room ID");
            }
          } catch (error) {
            console.error("Error validating room:", error);
          }
        };
    
        validateRoom();
      }, [roomId]);
      const createRoom = async () => {
        try {
          // Reference to 'rooms' collection in Firestore
          const roomsCollection = collection(fsdb, "rooms");
    
          // Add a new document to the 'rooms' collection
          const roomRef = await addDoc(roomsCollection, {
            createdAt: new Date(),
            status: "active",
          });
    
          const roomId = roomRef.id; // Get the generated room ID
          navigation(`/CallRoom/${roomId}`); // Navigate to the room
          console.log(`Room created with ID: ${roomId}`);
        } catch (error) {
          console.error("Error creating room:", error);
        }
    
        handleCloseMenu();
      };
    
      const joinRoom = () => {
        const roomId = prompt("Enter Room ID:");
        if (roomId) {
          navigation(`/CallRoom/${roomId}`); // Redirect to the entered room ID
        }
        handleCloseMenu(); // Close the menu
      };
      const findUserByUsername = async () => {
        try {
            // Reference to your collection
            const usersRef = collection(fsdb, "users");

            // Query for documents with the specified username
            const q = query(usersRef, where("username", "==", otherUser));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserDetails(userData[0]); // Assuming username is unique
                console.log(userDetails);
            } else {
                setUserDetails(null);
                console.log("No matching user found!");
            }
        } catch (error) {
            console.error("Error finding user:", error);
        }
    };
    useEffect(() => {
      const intervalId = setInterval(() => {
          if (!userDetails) {
              findUserByUsername();
          } else {
            console.log(userDetails)
              clearInterval(intervalId); 
          }
      }, 3000);

      return () => clearInterval(intervalId); 
  }, [userDetails]);

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
  const handleLogout = () => {
    removeCookie('user', { path: '/' });
    window.location.href = '/'; // Redirect to login page
};
const [anchorEl, setAnchorEl] = useState(null);
const handleOpenMenu = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleCloseMenu = () => {
  setAnchorEl(null);
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
             <CheckCircleOutlinedIcon style={{color:'green'}} />
            </IconButton>
          </Box>
        ) : (
          <Typography variant="h8">
            Chat with {userDetails?.nickname || "User"}
            <IconButton  onClick={() => setEditingNickname(true)}
              sx={{ cursor: "pointer"}}>
              <EditIcon />
            </IconButton>
          </Typography>
        )}
        <LogoutIcon onClick={handleLogout} style={{cursor:'pointer'}} aria-label="Logout"/>
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
            {messageDate} <AccountCircleOutlinedIcon sx={{paddingBlockStart:'10px', position:'relative',top:'2px'}} />
          </Typography>
        </Box>
      </ListItem>
    );
  })}
</List>

      </Paper>

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
            const roomId=prompt("Enter Room ID:");
            setroomId(roomId)

          }}
        >
          Join Room
        </MenuItem>
      </Menu>
        <IconButton onClick={handleOpenMenu}>
          <CallIcon />
        </IconButton>
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
