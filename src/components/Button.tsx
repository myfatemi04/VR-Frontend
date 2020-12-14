import React from "react";

export function Button({
  text,
  color,
  hoverColor,
  onClick,
  icon,
  className,
}: {
  text?: string;
  color?: string;
  hoverColor?: string;
  onClick: (event: React.MouseEvent) => void;
  icon: React.ReactChild;
  className?: string;
}) {
  const buttonText = text ?? "Text";
  const buttonColor = color ?? "bg-black";
  const buttonHoverColor = `hover:${hoverColor ?? "bg-gray-700"}`;

  return (
    <button
      className={`transition duration-500 ease-in-out transform hover:scale-95 text-white font-bold py-2 px-4 rounded-lg flex items-center ${buttonColor} ${buttonHoverColor} ${className}`}
      onClick={onClick}
    >
      {icon && <div className="mr-2 flex items-center">{icon}</div>}
      {buttonText}
    </button>
  );
}
