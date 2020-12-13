// React/Next.js
import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

// Three.js
import * as THREE from "three";
import { Canvas, useThree } from "react-three-fiber";
import Icon from "react-eva-icons/dist/Icon";
import Table from "../../threejsmodels/Table";

// Socket libraries
import Peer from "peerjs";
import { io } from "socket.io-client";

// Functions
import addKeyEvents from "../../addKeyEvents";
import React from "react";
import User from "../../components/User";
import CurrentUser from "../../components/CurrentUser";

const Chair = lazy(() => import("../../threejsmodels/Chair"));

const createStandardUser: (id: string) => Spaces.User = (id: string) => {
  return {
    id: id,
    username: "User",
    position: { x: 0, y: 0, z: 0 },
    color: "#ff7700",
    shape: "cube",
    stream: null,
    call: null,
    yaw: 0,
    pitch: 0,
  };
};

const OfficeSpacePage = () => {
  const { roomId } = useRouter().query;

  const [myMediaStream, setMyMediaStream] = useState(null);

  const peerjs = useRef<Peer | null>(null); // useRef(new Peer());
  const [userList, setUserList] = useState<Spaces.User[]>([]);
  const [userId, setUserId] = useState<string>(null!);
  const socket = React.useMemo(() => io("http://spaces-vr.herokuapp.com/"), []);

  useEffect(() => {
    const three = useThree();

    // Enable XR
    three.gl.xr.enabled = true;
  }, []);

  useEffect(() => {
    if (roomId == null) {
      return;
    }

    addKeyEvents(socket);

    socket.emit("room", roomId);
    socket.on("userId", (userId: string) => {
      // Store our userId for future reference
      setUserId(userId);

      // Now that we have our userId, we can start calling people
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        setMyMediaStream(stream);
      });

      // When another user connects
      socket.on("connected", (connectedUserId: string) => {
        // Initialize them to a standard user
        setUserList([...userList, createStandardUser(connectedUserId)]);
      });

      // When a user disconnects
      socket.on("disconnected", (disconnectedUserId: string) => {
        // Remove them from Three.js

        // Remove them from the users map
        setUserList(userList.filter((user) => user.id !== disconnectedUserId));
      });

      // When we receive data about a person, do this
      socket.on(
        "person-update",
        (updatedUserId: string, data: Spaces.UpdateData) => {
          setUserList((userList) => {
            let newUserList: Spaces.User[] = [];

            let found = false;
            for (let user of userList) {
              if (user.id !== updatedUserId) {
                newUserList.push(user);
              } else {
                newUserList.push({
                  ...user,
                  ...data,
                });

                found = true;
              }
            }

            if (!found) {
              let newUser = createStandardUser(updatedUserId);
              newUserList.push({
                ...newUser,
                ...data,
              });
            }

            return newUserList;
          });
        }
      );
    });
  }, [roomId]);

  useEffect(() => {
    // We only want to initialize PeerJS in this hook
    if (!peerjs.current) {
      // peerjs.current = new Peer();
    }

    if (myMediaStream && peerjs.current) {
      // Now, we start calling people we know
      for (let user of userList) {
        // We don't want to call ourselves
        if (user.id === userId) {
          continue;
        }

        // If the call already exists, don't call
        if (!user.call) {
          // Call the peer
          let call = peerjs.current.call(user.id, myMediaStream);

          // When we receive a stream from them, store it here
          call.on("stream", (stream) => {
            user.stream = stream;
          });
        }
      }

      // If we get called, we can now answer the calls
      peerjs.current.on("call", (call) => {
        // Find the user who's calling
        let user: Spaces.User = null;
        for (let user_ of userList) {
          if (user_.id === call.peer) {
            user = user_;
          }
        }

        if (!user) {
          console.warn("Received call from somebody not in this room!");
          console.warn("Not answering.");
          return;
        }

        // Store their call in the peers registry
        user.call = call;

        // Answer the call with our MediaStream
        call.answer(myMediaStream);

        // When we receive a stream from them, store it here
        call.on("stream", (stream) => {
          user.stream = stream;
        });
      });
    }
  }, [myMediaStream]);

  return (
    <>
      <Canvas
        concurrent
        shadowMap
        colorManagement
        camera={{ position: [2, 1, 2], fov: 90 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#021F4B"));
        }}
      >
        <Suspense fallback={null}>
          <Lights />
          <Chair position={[0, 0, -0.5]} rotation={[0, (Math.PI * 3) / 2, 0]} />
          <Chair position={[4, 0, 0]} rotation={[0, Math.PI, 0]} />
          <Table scale={[0.9, 0.7, 1]} position={[1, 0, 1]} />
          {userList.map((user) => {
            if (user.id === userId) {
              return <CurrentUser key={user.id} user={user}></CurrentUser>;
            } else {
              return <User key={user.id} user={user}></User>;
            }
          })}
        </Suspense>
      </Canvas>
    </>
  );
};

const CurrentUsers = () => {
  let icon = <Icon fill="#fff" name="person" size="medium" />;

  return (
    <div className="w-full bg-black rounded-lg">
      <div className="w-full p-3 rounded-t-lg bg-purple-700 text-white mt-4 text-md font-bold">
        <div className="flex items-center flex-row">
          {icon}
          <div className="ml-3">Usernames</div>
        </div>
      </div>
      <div className="w-full text-white p-3">
        <div className="font-bold mb-3 ml-3">autinmitra</div>
        <div className="font-bold mb-3 ml-3">myfatemi04</div>
        <div className="font-bold mb-3 ml-3">snandiraju</div>
      </div>
    </div>
  );
};

const Lights = () => {
  return (
    <>
      {/* Ambient Light illuminates lights for all objects */}
      <ambientLight intensity={0.3} color="#021F4B" />
      {/* Diretion light */}
      <directionalLight position={[10, 10, 5]} color="#021F4B" intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#021F4B"
      />
      {/* Sky light */}
      <hemisphereLight
        intensity={1}
        color={new THREE.Color("#021F4B")}
        groundColor={new THREE.Color("#000000")}
      />
    </>
  );
};

export default OfficeSpacePage;
