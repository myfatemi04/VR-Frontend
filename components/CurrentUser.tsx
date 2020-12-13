import React from "react";
import { useThree } from "react-three-fiber";

/**
 * A dummy react "component" that updates the camera pos and rotation
 * @param user The user data for the current user
 */
const CurrentUser = ({ user }: { user: Spaces.User }) => {
  const three = useThree();
  three.camera.position.set(
    user.position.x,
    user.position.y + 0.5,
    -user.position.z
  );
  three.camera.rotation.set(user.pitch, user.yaw, 0);

  return null;
};

export default CurrentUser;
