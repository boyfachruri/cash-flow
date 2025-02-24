"use client";

import React from "react";

const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundImage: "url('/background3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
};

export default Background;
