
import { useGLTF } from "drei";
import { useEffect, useState } from "react";
import GLTFLoader from 'three-gltf-loader';

export const AnimeTiddies = ({...props}) => {
  const [model, set] = useState()
  useEffect(() => void new GLTFLoader().load("/Base Female (Simple).glb", set), [])
  return model ? <primitive castshadow object={model.scene} {...props} /> : null
}

export default AnimeTiddies
