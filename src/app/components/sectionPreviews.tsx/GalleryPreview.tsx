import { JSX } from "react";
import Gallery3Images from "./Gallery/Gallery3Images";
import Gallery4Images from "./Gallery/Gallery4Images";
import Gallery5Images from "./Gallery/Gallery5Images";

const galleryMap: Record<string, JSX.Element> = {
  "3 Images": <Gallery3Images />,
  "4 Images": <Gallery4Images />,
  "5 Images": <Gallery5Images />
};

const GalleryPreview = ({ heading }: { heading: string }) => {
  console.log("heading", heading);
  return (
    galleryMap[heading] || (
      <p className="text-gray-400">Invalid Gallery Preview</p>
    )
  );
};

export default GalleryPreview;
