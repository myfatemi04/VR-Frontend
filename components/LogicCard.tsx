import { useRouter } from "next/router";
import React from "react";

import { CardTitle } from "./Typography";
import { Button } from "./Button";

import Icon from "react-eva-icons";

const LogicCard = ({ title, id }) => {
  const router = useRouter();

  let icon = <Icon fill="#fff" name="activity" size="medium" />;

  return (
    <div className="p-8 border-2 shadow-lg rounded-lg inline-block">
      <CardTitle>{title}</CardTitle>
      <img
        className="mt-4 w-72 h-48 rounded-lg"
        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      />
      <Button
        onClick={() => {
          router.push(`/space/${id}`);
        }}
        className="w-full text-center mt-4"
        text="Go to Space"
        icon={icon}
      />
    </div>
  );
};

export default LogicCard;
