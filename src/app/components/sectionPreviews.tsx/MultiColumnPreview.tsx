import React from "react";

const MultiColumnPreview = () => (
  <div className="flex items-center border border-slate-400 rounded-lg w-full bg-white">
    <div className="flex items-center justify-center gap-2 border-blue-300 w-full p-2">
      <div className="h-24 w-24 rounded-md flex items-center justify-center bg-gray-100">Image 1</div>
      <div className="h-24 w-24 rounded-md flex items-center justify-center bg-gray-100">Image 2</div>
      <div className="h-24 w-24 rounded-md flex items-center justify-center bg-gray-100">Image 3</div>
    </div>
  </div>
);

export default MultiColumnPreview;
