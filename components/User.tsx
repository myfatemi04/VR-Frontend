import { PositionalAudio } from "./PositionalAudio";
import React from "react";
import * as THREE from "three";
import { useThree } from "react-three-fiber";

const fontLoader = new THREE.FontLoader();

function distance(a, b, c, d, e, f) {
  return Math.sqrt((a - d) * (a - d) + (b - e) * (b - e) + (c - f) * (c - f));
}

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

        {/*
        <audio
          ref={(ref) => {
            if (user.stream) {
              ref.srcObject = user.stream;
            }
            const { camera } = useThree();
            ref.volume =
              10 /
              distance(
                camera.position.x,
                camera.position.y,
                camera.position.z,
                user.position.x,
                user.position.y,
                user.position.z
              );
          }}
        />*/}

        <meshBasicMaterial
          attach="material"
          color={user.color}
        ></meshBasicMaterial>
      </mesh>
    </>
  );
};

export default User;
