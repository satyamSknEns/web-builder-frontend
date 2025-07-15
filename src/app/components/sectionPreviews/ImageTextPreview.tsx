import Image from "next/image";
import React from "react";

interface ImageTextContent {
  imageUrl: string;
  heading_text: string;
  description_text: string;
  image_alignment: "left" | "right";
  // section_height?: "small" | "medium" | "large";
}

interface ImageTextPreviewProps {
  content?: ImageTextContent;
}

interface FieldDefinition {
  type: "image" | "select" | "text" | "textarea";
  id: string;
  label: string;
  default?: string;
  // options?: { value: string; label: string }[];
}

export const schema = {
  name: "Image With Text",
  allFields: [
    // {
    //   type: "select",
    //   id: "section_height",
    //   label: "Section Height",
    //   options: [
    //     { value: "small", label: "Small" },
    //     { value: "medium", label: "Medium" },
    //     { value: "large", label: "Large" },
    //   ],
    //   default: "large",
    // },
    {
      type: "image",
      id: "imageUrl",
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

const ImageTextPreview: React.FC<ImageTextPreviewProps> = ({ content }) => {
  const defaultImageUrl = schema.allFields.find(
    (f) => f.id === "image_text"
  )?.default;
  const defaultHeading = schema.allFields.find(
    (f) => f.id === "heading_text"
  )?.default;
  const defaultDescription = schema.allFields.find(
    (f) => f.id === "description_text"
  )?.default;
  const defaultImageAlignment = schema.allFields.find(
    (f) => f.id === "image_alignment"
  )?.default;
  // const defaultSectionHeight = schema.allFields.find( (f) => f.id === "section_height" )?.default as "small" | "medium" | "large" | undefined;

  const currentImageUrl = content?.imageUrl || defaultImageUrl;
  const currentHeading = content?.heading_text || defaultHeading;
  const currentDescription = content?.description_text || defaultDescription;
  const currentImageAlignment =
    content?.image_alignment || defaultImageAlignment;
  // const currentSectionHeight = content?.section_height || defaultSectionHeight || "large";

  // const heightClasses = { small: "h-64", medium: "h-[320px]", large: "h-[400px]", };

  // const selectedHeightClass = heightClasses[currentSectionHeight];
  return (
    <div
      className={`flex items-center justify-center flex-col h- border border-slate-400 rounded-md overflow-hidden shadow bg-white p-8`}
    >
      <div
        className={`flex items-center justify-center ${ currentImageAlignment === "right" ? "flex-row-reverse" : "" }`}
      >
        <div className={`w-1/2 bg-gray-100 flex items-center justify-center border border-slate-400`}>
          <Image
            src={currentImageUrl || "/assets/placeholder.jpg"}
            alt="image-text"
            width={1000}
            height={1000}
            className={`w-full transition-transform duration-300`}
          />
        </div>
        <div className="w-1/2 p-4">
          <p className="font-medium mb-2 text-xl">
            {currentHeading || "Heading"}
          </p>
          <p className="text-gray-600 text-sm">
            {currentDescription ||
              "This is a description for the image with text section."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageTextPreview;
