// React/Next.js
import React, { Suspense, useEffect, useState } from "react";

// Three.js
import * as THREE from "three";
import { Canvas } from "react-three-fiber";

// Socket libraries
import { io } from "socket.io-client";
import * as twilio from "twilio-video";

// Functions
import addKeyEvents from "../addKeyEvents";
import User from "../components/User";
import CurrentUser from "../components/CurrentUser";
import Model from "../components/Model";

import { useParams } from "react-router-dom";

const CHAIR_PATH = "/models/SitzfeldPanama.glb";
const CAR_PATH = "/models/Ferrari 51.glb";
const TABLE_PATH = "/models/table.glb";

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
  const { roomID } = useParams<{ roomID: string }>();
  const [userList, setUserList] = useState<Spaces.User[]>([]);
  const [userID, setUserID] = useState<string>(null!);
  const [twilioRoom, setTwilioRoom] = useState<twilio.Room>(null!);
  const socket = React.useMemo(() => io("http://spaces-vr.herokuapp.com/"), []);

  useEffect(() => {
    if (roomID == null) {
      return;
    }

    addKeyEvents(socket);

    socket.emit("room", roomID);
    socket.on(
      "joined-room",
      ({ userID, accessToken }: { userID: string; accessToken: string }) => {
        console.log(
          "Joined room! userID:",
          userID + ", accesstoken:",
          accessToken
        );

        // Store our userID for future reference
        setUserID(userID);

        twilio
          .connect(accessToken, { audio: true, video: false })
          .then((room) => {
            setTwilioRoom(room);
          });

        // When another user connects
        socket.on("connected", (connectedUserID: string) => {
          // Initialize them to a standard user
          setUserList((userList) => [
            ...userList,
            createStandardUser(connectedUserID),
          ]);
        });

        // When a user disconnects
        socket.on("disconnected", (disconnectedUserID: string) => {
          // Remove them from Three.js

          // Remove them from the users map
          setUserList((userList) =>
            userList.filter((user) => user.id !== disconnectedUserID)
          );
        });

        // When we receive data about a person, do this
        socket.on(
          "person-update",
          (updatedUserID: string, data: Spaces.UpdateData) => {
            setUserList((userList) => {
              let newUserList: Spaces.User[] = [];

              let found = false;
              for (let user of userList) {
                if (user.id !== updatedUserID) {
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
                let newUser = createStandardUser(updatedUserID);
                newUserList.push({
                  ...newUser,
                  ...data,
                });
              }

              return newUserList;
            });
          }
        );
      }
    );
  }, [roomID, socket]);

  useEffect(() => {
    if (twilioRoom) {
      const setAudioTrackForParticipant = (
        participantID: string,
        stream: MediaStream
      ) => {
        setUserList((userList) => {
          return userList.map((user) => {
            if (user.id === participantID) {
              return {
                ...user,
                stream,
              } as Spaces.User;
            } else {
              return user;
            }
          });
        });
      };

      const addParticipant = (participant: twilio.Participant) => {
        let participantID = participant.identity;

        for (let audioTrack of Array.from(participant.audioTracks.values())) {
          audioTrack.on("subscribed", (track) => {
            console.log("adding stream", track.mediaStreamTrack);
            let stream = new MediaStream([track.mediaStreamTrack]);
            setAudioTrackForParticipant(participantID, stream);
          });
        }

        participant.on(
          "trackPublished",
          (publication: twilio.RemoteTrackPublication) => {
            if (publication.kind === "audio") {
              if (publication.track?.kind === "audio") {
                let stream = new MediaStream([
                  publication.track.mediaStreamTrack,
                ]);

                setAudioTrackForParticipant(participantID, stream);
              }
            }
          }
        );
      };

      twilioRoom.participants.forEach(addParticipant);

      twilioRoom.on("participantConnected", addParticipant);

      return () => {
        twilioRoom.off("participantConnected", addParticipant);
      };
    }
  }, [twilioRoom]);

  return (
    <>
      <div className="w-100 h-100 z-10 relative">
        <CurrentUsers users={userList} />
      </div>
      <Canvas
        concurrent
        shadowMap
        colorManagement
        camera={{ position: [2, 1, 2], fov: 90 }}
        onCreated={({ gl }) => {
          gl.xr.enabled = true;
          gl.setClearColor(new THREE.Color("#021F4B"));
        }}
      >
        <Suspense fallback={null}>
          <Lights />
          <Model
            path={CHAIR_PATH}
            position={[0, 0, -0.5]}
            rotation={[0, (Math.PI * 3) / 2, 0]}
          />
          <Model
            path={CHAIR_PATH}
            position={[4, 0, 0]}
            rotation={[0, Math.PI, 0]}
          />
          <Model path={TABLE_PATH} scale={[0.9, 0.7, 1]} position={[1, 0, 1]} />
          <Model path={CAR_PATH} scale={[0.5, 0.5, 0.5]} position={[1, 0, 1]} />

          {userList.map((user) => {
            if (user.id === userID) {
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

const CurrentUsers = ({ users }: { users: Spaces.User[] }) => {
  // let icon = <Icon fill="#fff" name="person" size="medium" />;

  return (
    <div className="w-full bg-black rounded-lg absolute m-8">
      <div className="w-full p-3 rounded-t-lg bg-purple-700 text-white text-md font-bold">
        <div className="flex items-center flex-row">
          {/* {icon} */}
          <div className="ml-3">Usernames</div>
        </div>
      </div>
      <div className="w-full text-white p-3">
        {users.map((user) => {
          return (
            <div className="font-bold mb-3 ml-3" key={user.id}>
              {user.username}
            </div>
          );
        })}
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
