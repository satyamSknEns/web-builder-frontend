import Image from "next/image";
import React from "react";

const GalleryPreview = () => (
  <div className="flex gap-2 p-2 border border-slate-400 items-center justify-center rounded-md overflow-hidden shadow bg-white mb-4 w-full">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`w-1/3 bg-gray-200 flex items-center justify-center border border-slate-400`}
      >
        <Image
          src="/assets/placeholder.jpg"
          alt="image placeholder"
          width={200}
          height={100}
          className="w-full"
        />
      </div>
    ))}
  </div>
);

export default GalleryPreview;
