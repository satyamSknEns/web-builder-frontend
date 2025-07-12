import Image from "next/image";
import React from "react";

interface ImageTextContent {
  imageUrl: string; 
  heading_text: string;
  description_text: string;
  image_alignment: "left" | "right";
}

interface ImageTextPreviewProps {
  content?: ImageTextContent; 
}

const ImageTextPreview: React.FC<ImageTextPreviewProps> = ({ content }) => {
  const defaultImageUrl = schema.allFields.find(f => f.id === "image_text")?.default;
  const defaultHeading = schema.allFields.find(f => f.id === "heading_text")?.default;
  const defaultDescription = schema.allFields.find(f => f.id === "description_text")?.default;
  const defaultImageAlignment = schema.allFields.find(f => f.id === "image_alignment")?.default;

  const currentImageUrl = content?.imageUrl || defaultImageUrl;
  const currentHeading = content?.heading_text || defaultHeading;
  const currentDescription = content?.description_text || defaultDescription;
  const currentImageAlignment = content?.image_alignment || defaultImageAlignment;


  return (
    <div className="flex flex-col border border-slate-400 rounded-md overflow-hidden shadow bg-white mb-4">
      <div className={`flex items-center p-2 ${currentImageAlignment === 'right' ? 'flex-row-reverse' : ''}`}>
        <div className="w-1/2 bg-gray-100 flex items-center justify-center border border-slate-400">
          <Image
            src={currentImageUrl || "/assets/placeholder.jpg"} 
            alt="image placeholder"
            width={100}
            height={50}
            className="w-full h-auto max-h-24 object-contain"
          />
        </div>
        <div className="w-1/2 p-4">
          <p className="font-semibold mb-2 text-sm">
            {currentHeading || "Heading"}
          </p>
          <p className="text-gray-600 text-xs">
            {currentDescription || "This is a description for the image with text section."}
          </p>
        </div>
      </div>
    </div>
  );
};

interface FieldDefinition {
  type: "image" | "select" | "text" | "textarea";
  id: string;
  label: string;
  default?: string;
  options?: { value: string; label: string }[];
}

export const schema = {
  name: "Image With Text",
  allFields: [
    {
      type: "image",
      id: "image_text",
      label: "Select Image",
      default: "/assets/placeholder.jpg",
    },
    {
      type: "select",
      id: "image_alignment",
      label: "Position Your Image",
      options: [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
      ],
      default: "left",
    },
    {
      type: "text",
      id: "heading_text",
      label: "Write Your Heading",
      default: "Image With Text Heading",
    },
    {
      type: "textarea",
      id: "description_text",
      label: "Write Description",
      default:
        "Pair large text with an image to give focus to your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.",
    },
  ] as FieldDefinition[],
};

export default ImageTextPreview;