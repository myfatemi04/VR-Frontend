import React from "react";
import { Link } from "react-router-dom";

import { CardTitle } from "./Typography";

const OFFICE_IMAGE =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

const LogicCard = ({
  title,
  id,
  brightness,
}: {
  title: string;
  id: number;
  brightness: number;
}) => {
  return (
    <div className="p-8 border-2 shadow-lg rounded-lg inline-block">
      <CardTitle>{title}</CardTitle>
      <img
        className="mt-4 w-72 h-48 rounded-lg"
        src={OFFICE_IMAGE}
        alt="Office"
      />
      <Link to={`/space/${id}`} className="w-full text-center mt-4">
        Go to Space
      </Link>
    </div>
  );
};

export default LogicCard;
