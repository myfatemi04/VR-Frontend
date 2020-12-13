import { useEffect, useState } from "react";
import GLTFLoader from "three-gltf-loader";

export const Car = ({ ...props }) => {
  const [model, set] = useState();
  useEffect(() => void new GLTFLoader().load("/Ferrari 51.glb", set), []);
  return model ? (
    <primitive castshadow object={model.scene} {...props} />
  ) : null;
};

export default Car;
