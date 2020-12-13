// React/Next.js
import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

// Three.js
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import Icon from "react-eva-icons/dist/Icon";
import Table from "../../threejsmodels/Table";
import Car from "../../threejsmodels/Car";

// Socket libraries
import { io } from "socket.io-client";
import * as twilio from "twilio-video";

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
  const { roomID } = useRouter().query;
  const [userList, setUserList] = useState<Spaces.User[]>([]);
  const [userID, setUserID] = useState<string>(null!);
  const [twilioRoom, setTwilioRoom] = useState<twilio.Room>(null!);
  const socket = React.useMemo(() => io("http://localhost:5000/"), []);

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
          setUserList([...userList, createStandardUser(connectedUserID)]);
        });

        // When a user disconnects
        socket.on("disconnected", (disconnectedUserID: string) => {
          // Remove them from Three.js

          // Remove them from the users map
          setUserList(
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
  }, [roomID]);

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
            if (
              publication.kind === "audio" &&
              publication.track.kind === "audio"
            ) {
              let stream = new MediaStream([
                publication.track.mediaStreamTrack,
              ]);

              setAudioTrackForParticipant(participantID, stream);
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
          <Chair position={[0, 0, -0.5]} rotation={[0, (Math.PI * 3) / 2, 0]} />
          <Chair position={[4, 0, 0]} rotation={[0, Math.PI, 0]} />
          <Table scale={[0.9, 0.7, 1]} position={[1, 0, 1]} />
          <Car scale={[0.5, 0.5, 0.5]} position={[1, 0, 1]} />
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
