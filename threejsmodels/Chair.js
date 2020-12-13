import { useEffect, useState } from "react";
import GLTFLoader from "three-gltf-loader";

export const Chair = ({ ...props }) => {
  const [model, set] = useState();
  useEffect(() => void new GLTFLoader().load("/SitzfeldPanama.glb", set), []);
  return model ? (
    <primitive castshadow object={model.scene} {...props} />
  ) : null;
};

export default Chair;
