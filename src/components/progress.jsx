import React from "react";

const CircularProgressBar = ({ progress = 45, letter , size  }) => {
  // Calculate stroke properties
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

{/* <FaRegDotCircle /> */}


  return (
    <div
      className="circular-progress-container "
      style={{ width: size, height: size , marginRight: "10px"}}
    >
      {/* Background Circle */}
      <svg width={size} height={size}>
        <circle
          className="circular-progress-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          className="circular-progress-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={letter==='A' ? "#4caf50" : "tomato" }
          
          
          
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>
      {/* Letter in the center */}
      <span
        className="circular-progress-letter"
        style={{ fontSize: size / 3 }}
      >
        {letter}
      </span>
    </div>
  );
};

export default CircularProgressBar;