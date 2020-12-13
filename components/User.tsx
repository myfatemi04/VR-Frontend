import { PositionalAudio } from "./PositionalAudio";
import React from "react";
import * as THREE from "three";

const fontLoader = new THREE.FontLoader();

const User = ({ user }: { user: Spaces.User }) => {
  let [font, setFont] = React.useState<THREE.Font>();

  React.useEffect(() => {
    fontLoader.load(
      "/fonts/sofia-pro.json",
      (font) => {
        console.log("Loaded font");
        setFont(font);
      },
      () => 0,
      (error) => {
        console.error("Error loading the font:", error);
      }
    );
  }, []);

  let textGeometry = React.useMemo(() => {
    if (font) {
      return new THREE.TextGeometry(user.username, {
        font,
        size: 0.1,
        height: 0.1,
      });
    }
  }, [user.username, font]);

  console.log(user.stream);

  return (
    <>
      {font ? (
        <mesh
          position={[user.position.x, user.position.y + 1, user.position.z]}
          geometry={textGeometry}
        >
          <meshBasicMaterial
            attach="material"
            color="#FFFFFF"
          ></meshBasicMaterial>
        </mesh>
      ) : null}
      <mesh
        position={[user.position.x, user.position.y + 0.5, user.position.z]}
      >
        {user.shape === "cube" ? (
          <boxGeometry></boxGeometry>
        ) : (
          <sphereGeometry></sphereGeometry>
        )}

        {user.stream ? (
          <PositionalAudio
            url={URL.createObjectURL(user.stream)}
          ></PositionalAudio>
        ) : null}

        <meshBasicMaterial
          attach="material"
          color={user.color}
        ></meshBasicMaterial>
      </mesh>
    </>
  );
};

export default User;
