import { useEffect, useState } from "react";
import GLTFLoader from 'three-gltf-loader';

export const Table = ({...props}) => {
  const [model, set] = useState()
  useEffect(() => void new GLTFLoader().load("/table.glb", set), [])
  return model ? <primitive castshadow object={model.scene} {...props} /> : null
}

export default Table