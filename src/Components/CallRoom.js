import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db, fsdb } from "../firebase"; // Assuming fsdb is your Firestore instance
import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Peer from "peerjs";

const CallRoom = () => {
  const { roomId } = useParams();
  const myVideo = useRef();
  const videoGrid = useRef();
  const peerInstance = useRef();
  const myStream = useRef();
  const [roomData, setRoomData] = useState(null);
  const [userName, setUserName] = useState(""); // User's name
  const [isJoined, setIsJoined] = useState(false);
  const [count,setcount]=useState(0);
  // Handle when user clicks on "Join Room"
  const joinRoom = async () => {
    if (!userName.trim()) {
      alert("Please enter your name before joining the room.");
      return;
    }
    setIsJoined(true);
    await initCall();
  };

  // Initialize the call (PeerJS and media stream)
  const initCall = async () => {
    try {
      // Fetch media stream (audio and video)
      myStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const video = document.createElement("video");
      video.muted = true;
      addVideoStream(video, myStream.current, userName); // Add your video to the grid

      // Initialize PeerJS
      peerInstance.current = new Peer(undefined);

      // Handle PeerJS open event (peerId is generated)
      peerInstance.current.on("open", async (peerId) => {
        // Add user to room in Firestore
        const roomRef = doc(fsdb, "rooms", roomId);
        await updateDoc(roomRef, {
          [`peers.${peerId}`]: { name: userName, joinedAt: new Date() },
        });

        listenForConnections(roomRef, peerId);
      });
    } catch (error) {
      console.error("Error initializing call:", error);
    }
  };

  // Listen for other peers joining and signaling data
  const listenForConnections = (roomRef, peerId) => {
    // Listen for changes in room data in Firestore
    const unsub = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setRoomData(data);
        setcount(count+1);
        // Handle remote offers and other signaling data
        Object.entries(data.peers || {}).forEach(([remotePeerId, info]) => {
          if (remotePeerId !== peerId && info.offer) {
            handleOffer(remotePeerId, info.offer, info.name);
          }
        });
      }
    });

    return () => unsub();
  };

  // Handle incoming offers from other peers
  const handleOffer = async (remotePeerId, offer, remoteName) => {
    const call = peerInstance.current.call(remotePeerId, myStream.current);
    const video = document.createElement("video");

    call.on("stream", (remoteStream) => {
      addVideoStream(video, remoteStream, remoteName);
    });
  };

  // Add a video stream to the UI
  const addVideoStream = (video, stream, name) => {
    video.srcObject = stream;

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.margin = "10px";

    const nameTag = document.createElement("p");
    nameTag.textContent = name || "Unknown User";
    nameTag.style.position = "absolute";
    nameTag.style.bottom = "0";
    nameTag.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    nameTag.style.color = "white";
    nameTag.style.padding = "2px 5px";
    nameTag.style.fontSize = "14px";
    nameTag.style.borderRadius = "5px";

    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    container.append(video);
    container.append(nameTag);
    videoGrid.current.append(container);
  };

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h1>Participant: {count}</h1>
      {/* Display the user name input if the user has not joined */}
      {!isJoined ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          {/* Display the video grid when the user is joined */}
          <div ref={videoGrid} style={{ display: "flex", flexWrap: "wrap" }}></div>
        </div>
      )}
    </div>
  );
};

export default CallRoom;
