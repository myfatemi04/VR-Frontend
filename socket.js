import * as sockets from "socket.io-client";
import state from "./state";

const socket = sockets.io("/");

socket.on("userId", (userId) => {
  // Store the assigned userId
  state.userId = userId;
});

export const joinRoom = (roomId) => {
  socket.emit("room", roomId);
};

export const jump = () => {
  socket.emit("jump", 2);
};

export const turnOnFlying = () => {
  socket.emit("set-flying", true);
};

export const turnOffFlying = () => {
  socket.emit("set-flying", false);
};

export const flyUp = () => {
  socket.emit("fly", 1);
};

export const flyDown = () => {
  socket.emit("fly", -1);
};

export const moveForward = () => {
  socket.emit("move-forward-backward", 1);
};

export const moveBackward = () => {
  socket.emit("move-forward-backward", -1);
};

export const moveRight = () => {
  socket.emit("move-right-left", 1);
};

export const moveLeft = () => {
  socket.emit("move-right-left", -1);
};

export const createUser = () => ({
  body: null,
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  velocity: {
    x: 0,
    y: 0,
    z: 0,
  },
  yaw: 0,
  pitch: 0,
  mediaStream: null,
});

socket.on("connected", (connectedUserId) => {
  console.log("Person connected:", connectedUserId);
  state.users[connectedUserId] = createUser();
});

socket.on("disconnected", (disconnectedUserId) => {
  console.log("Person disconnected:", disconnectedUserId);
  delete state.users[disconnectedUserId];
});

socket.on("username", (userId, username) => {
  console.log("Updated username for person", userId + ":", username);
  state.users[userId].username = username;
});

socket.on("person", (userId, person) => {
  console.log("Received info about person", userId + ":", person);
  Object.assign(state.users[userId], person);
});

socket.on("color", (userId, color) => {
  console.log("Updated color for person", userId + ":", color);
  state.users[userId].color = color;
});

socket.on("shape", (userId, shape) => {
  console.log("Updated shape for person", userId + ":", shape);
  state.users[userId].shape = shape;
});
