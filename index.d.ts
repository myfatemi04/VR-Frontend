declare namespace Spaces {
  type UpdateData = {
    position: {
      x: number;
      y: number;
      z: number;
    };
    yaw: number;
    pitch: number;
    color: string;
    shape: "sphere" | "cube";
    username: string;
  };

  type User = UpdateData & {
    stream: null | MediaStream;
    call: null | Peer.MediaConnection;
    id: string;
  };
}
