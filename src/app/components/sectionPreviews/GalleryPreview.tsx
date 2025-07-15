import Image from "next/image";
import Link from "next/link";
import React from "react";

interface GalleryItem {
  image: string;
  link: string;
  caption_text: string;
}

interface GalleryContent {
  gallery_title?: string;
  section_height?: "small" | "medium" | "large";
  items?: GalleryItem[];
}

interface GalleryPreviewProps {
  content?: GalleryContent;
}

interface ArrayFieldDefinition {
  type: "array";
  id: string;
  label: string;
  name: string;
  itemFields: FieldDefinition[];
  maxItems?: number;
}

interface FieldDefinition {
  type: "image" | "select" | "text" | "textarea" | "number" | "array" | "url";
  id: string;
  label: string;
  default?: string | number;
  options?: { value: string; label: string }[];
  info?: string;
  name?: string;
  itemFields?: FieldDefinition[];
  maxItems?: number;
}

interface SectionSchema {
  name: string;
  max_items?: number;
  allFields: FieldDefinition[];
  defaultImagesSchema?: {
    imageUrl: string;
    buttonText: string;
    buttonUrl: string;
  };
  items?: any;
}

export const schema: SectionSchema = {
  name: "Gallery Section",
  max_items: 3,
  allFields: [
    {
      type: "text",
      id: "gallery_title",
      label: "Heading Title",
      default: "Our Featured Work",
    },
    {
      type: "select",
      id: "section_height",
      label: "Section Height",
      default: "medium",
      options: [
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Large",
          value: "large",
        },
      ],
    },
    {
      type: "array",
      id: "items",
      label: "Gallery Items",
      name: "Image",
      itemFields: [
        {
          type: "image",
          id: "image",
          label: "Select Image",
          default: "/assets/placeholder.jpg",
        },
        {
          type: "url",
          id: "link",
          label: "Item Link (URL)",
          info: "Optional link for the image/item",
          // default: "#",
        },
        {
          type: "text",
          id: "caption_text",
          label: "Caption Text",
          info: "Optional text overlay on the image",
          // default: "View Item",
        },
      ],
    } as ArrayFieldDefinition,
  ] as FieldDefinition[],

  defaultImagesSchema: {
    imageUrl: "/assets/placeholder.jpg",
    buttonText: "More",
    buttonUrl: "#",
  },
};

const GalleryPreview: React.FC<GalleryPreviewProps> = ({ content }) => {
  const defaultHeading =
    (schema.allFields.find((f) => f.id === "gallery_title")
      ?.default as string) || "Our Featured Work";
  const defaultSectionHeight =
    (schema.allFields.find((f) => f.id === "section_height")?.default as
      | "small"
      | "medium"
      | "large") || "medium";

  const itemsFieldDefinition = schema.allFields.find(
    (field) => field.id === "items" && field.type === "array"
  ) as ArrayFieldDefinition | undefined;

  const defaultItemValues: GalleryItem = {
    image:
      (itemsFieldDefinition?.itemFields.find((f) => f.id === "image")
        ?.default as string) || "/assets/placeholder.jpg",
    link: itemsFieldDefinition?.itemFields.find((f) => f.id === "link")
      ?.default as string,
    caption_text: itemsFieldDefinition?.itemFields.find(
      (f) => f.id === "caption_text"
    )?.default as string,
  };

  const currentHeading = content?.gallery_title || defaultHeading;
  const currentSectionHeight = content?.section_height || defaultSectionHeight;

  const numDefaultItems = schema.max_items || 3;
  const hydratedItems =
    content?.items && content.items.length > 0
      ? content.items.map((item) => ({ ...defaultItemValues, ...item }))
      : Array.from({ length: numDefaultItems }).map(() => ({
          ...defaultItemValues,
        }));

  const itemsToDisplay = hydratedItems.slice(0, numDefaultItems);

  const getHeightClass = (height: "small" | "medium" | "large") => {
    switch (height) {
      case "small":
        return "h-[300px]";
      case "medium":
        return "h-[400px]";
      case "large":
        return "h-[500px]";
      default:
        return "h-[400px]";
    }
  };

  const sectionHeightClass = getHeightClass(currentSectionHeight);

  return (
    <div
      className={`relative flex flex-col items-center justify-center border border-slate-400 rounded-md shadow bg-white mb-4 w-full ${sectionHeightClass} p-8`}
    >
      {currentHeading && (
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {currentHeading}
        </h3>
      )}
      <div className="flex flex-col sm:flex-row gap-1 w-full items-center justify-between py-2">
        {itemsToDisplay.map((item, index) => {
          const itemContent = (
            <>
              <Image
                src={item.image || "/assets/placeholder.jpg"}
                alt={`Gallery item ${index + 1}`}
                width={1000}
                height={1000}
                className="w-full h-full transition-transform duration-300 relative object-cover opacity-80"
              />
              {item.caption_text && (
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out bg-black/40 ${
                    item.link && "group-hover:bg-black/70"
                  } text-white text-lg font-semibold text-center px-4`}
                >
                  {item.caption_text}
                </div>
              )}
            </>
          );

          if (item.link && item.link !== "#") {
            return (
              <Link
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-center flex-col w-1/3 ${
                  currentSectionHeight === "small"
                    ? "max-h-50"
                    : currentSectionHeight === "medium"
                    ? "max-h-70 h-full"
                    : "h-full"
                } relative overflow-hidden rounded-md border border-slate-300 ${
                  item.link && "cursor-pointer"
                }`}
                aria-label={`Link to ${item.caption_text || "gallery item"}`}
              >
                {itemContent}
              </Link>
            );
          } else {
            return (
              <div
                key={index}
                className={`group flex items-center justify-center flex-col w-1/3 ${
                  currentSectionHeight === "small"
                    ? "max-h-50"
                    : currentSectionHeight === "medium"
                    ? "max-h-70 h-full"
                    : "h-full"
                } relative overflow-hidden rounded-md border border-slate-300`}
              >
                {itemContent}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default GalleryPreview;
