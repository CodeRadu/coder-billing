import React from "react";
import "./loading.css";

type Params = {
  size: number;
};

export default function Loading({ size }: Params) {
  return (
    <div className="flex justify-center items-center h-screen">
      <svg width={size} height={size} stroke="#000" viewBox="0 0 24 24">
        <g className="spinner">
          <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
        </g>
      </svg>
    </div>
  );
}
