import { useEffect, useState } from "react";
import GLTFLoader from "three-gltf-loader";

const loader = new GLTFLoader();

const Model = ({
  path,
  ...props
}: {
  path: string;
  object?: any;
  [property: string]: any;
}) => {
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    loader.load(path, (gltf) => setModel(gltf));
  }, [path]);

  if (model) {
    return <primitive castshadow object={model.scene} {...props} />;
  } else {
    return null;
  }
};

export default Model;
