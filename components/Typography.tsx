import React from "react";

export function NavTitle({ children, className }) {
  return (
    <div className={`font-bold text-xl text-black ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`font-bold text-2xl text-black ${className}`}>
      {children}
    </div>
  );
}

export function GesturePageTitle({ children, className }) {
  return (
    <div className={`font-bold text-4xl text-black ${className}`}>
      {children}
    </div>
  );
}

export function GesturePageSecondaryTitle({ children, className }) {
  return <div className={`text-md text-gray-600 ${className}`}>{children}</div>;
}
