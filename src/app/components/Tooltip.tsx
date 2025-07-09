import React from "react";

const Tooltip = ({ children, message, position = "top", width = "auto", maxWidth = "100px", bg = "bg-white" }) => {
  const tooltipContent = typeof message === "function" ? message() : message;
  // console.log("position",position);
  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={`absolute ${position === 'top' ? 'bottom-full left-1/2' : position === 'bottom' ? 'top-full left-1/2' : position === 'left' ? 'right-3 -top-0.5' : '-right-full -top-0.5 translate-x-1/2'} ${position === 'right' ? 'translate-x-1/2' : '-translate-x-1/2'} mb-2 transform  ${bg} text-black text-xs rounded-md py-1 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border-blue-400 shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
        style={{ width: width, maxWidth: maxWidth }}
      >
        {tooltipContent}
        <div className={`absolute w-2 h-2 ${bg} transform rotate-45 ${getArrowPosition(position)}`} />
      </div>
    </div>
  );
};

const getArrowPosition = (position:any) => {
  switch (position) {
    case "top":
      return "bottom-[-4px] left-1/2 transform -translate-x-1/2";
    case "bottom":
      return "top-[-4px] left-1/2 transform -translate-x-1/2 rotate-45";
    case "left":
      return "top-1/2 right-[-4px] transform -translate-y-1/2 -rotate-90";
    case "right":
      return "top-1/2 left-[-4px] transform -translate-y-1/2 -rotate-90";
    default:
      return "bottom-[-4px] left-1/2 transform -translate-x-1/2";
  }
};

export default Tooltip;
