import React from "react";

const ImageTextPreview = () => (
  <div className="flex flex-col border border-slate-400 rounded-md overflow-hidden shadow bg-white mb-4">
    <div className="flex items-center justify-between p-2">
      <div className="w-1/2 p-4 bg-gray-100 text-center text-sm">
        Image Placeholder
      </div>
      <div className="w-1/2 p-4">
        <p className="font-semibold mb-2 text-sm">Heading</p>
        <p className="text-gray-600 text-xs">
          This is a description for the image with text section.
        </p>
      </div>
    </div>
  </div>
);

export default ImageTextPreview;
// 