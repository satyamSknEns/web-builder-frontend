import Image from "next/image";
import React from "react";

interface GalleryImage {
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
}

interface GalleryContent {
  images: GalleryImage[];

  heading: string;
  galleryLayout: "vertical" | "horizontal";
}

interface GalleryPreviewProps {
  content?: GalleryContent;
}

const GalleryPreview: React.FC<GalleryPreviewProps> = ({ content }) => {
  const defaultImages: GalleryImage[] = [
    { imageUrl: "/assets/placeholder.jpg", buttonText: "More", buttonUrl: "#" },
    { imageUrl: "/assets/placeholder.jpg", buttonText: "More", buttonUrl: "#" },
    { imageUrl: "/assets/placeholder.jpg", buttonText: "More", buttonUrl: "#" },
  ];

  const currentImages =
    content?.images && content.images.length > 0
      ? content.images
      : defaultImages;
  const currentGalleryLayout =
    content?.galleryLayout ||
    schema.allFields.find((f) => f.id === "galleryLayout")?.default ||
    "horizontal";

  const flexDirectionClass =
    currentGalleryLayout === "vertical" ? "flex-col" : "flex-row";

  return (
    <div
      className={`flex ${flexDirectionClass} gap-2 p-2 border border-slate-400 items-center justify-center rounded-md overflow-hidden shadow bg-white mb-4 w-full`}
    >
      {currentImages.slice(0, 3).map((image, index) => (
        <div
          key={index}
          className={`w-1/3 ${
            currentGalleryLayout === "vertical" ? "w-full" : ""
          } bg-gray-200 flex items-center justify-center border border-slate-400`}
        >
          <Image
            src={image.imageUrl || "/assets/placeholder.jpg"}
            alt={`Gallery image ${index + 1}`}
            width={200}
            height={100}
            className="w-full h-auto object-contain"
          />
          {/* You could add a small overlay for buttonText here if desired for preview */}
          {image.buttonText && (
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-[8px] px-1 py-0.5 rounded">
              {image.buttonText}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface FieldDefinition {
  type: "image" | "select" | "text" | "textarea" | "number";
  id: string;
  label: string;
  default?: string | number;
  options?: { value: string; label: string }[];
}

export const schema = {
  name: "Gallery Section",
  allFields: [
    {
      type: "number",
      id: "imageCount",
      label: "Number of Images",
      default: 3,
    },
    {
      type: "select",
      id: "galleryLayout",
      label: "Gallery Layout",
      options: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
      ],
      default: "horizontal",
    },
    {
      type: "text",
      id: "heading",
      label: "Gallery Heading",
      default: "Our Gallery",
    },
  ] as FieldDefinition[],

  defaultImagesSchema: {
    imageUrl: "/assets/placeholder.jpg",
    buttonText: "More",
    buttonUrl: "#",
  },
};

export default GalleryPreview;
