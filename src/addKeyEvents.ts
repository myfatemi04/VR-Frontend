import { Socket } from "socket.io-client";

const addKeyEvents = (socket: Socket) => {
  window.addEventListener("keydown", (event) => {
    // Send movement events accordingly
    switch (event.key) {
      case " ": // spacebar
        socket.emit("jump", 5);
        break;

      case "a": // left
        socket.emit("move-right-left", -1);
        break;

      case "d": // right
        socket.emit("move-right-left", 1);
        break;

      case "s": // backwards
        socket.emit("move-forwards-backwards", -1);
        break;

      case "w": // forwards
        socket.emit("move-forwards-backwards", 1);
        break;

      case "ArrowLeft":
        socket.emit("rotate-counterclockwise", Math.PI / 4);
        break;

      case "ArrowRight":
        socket.emit("rotate-counterclockwise", -Math.PI / 4);
    }
  });
};

export default addKeyEvents;
