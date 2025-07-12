import Image from "next/image";
import React from "react";

interface FieldDefinition {
  type: "image" | "select" | "text" | "textarea";
  id: string;
  label: string;
  default?: string;
  options?: { value: string; label: string }[];
}

interface SectionSchema {
  name: string;
  allFields: FieldDefinition[];
}

interface SectionEditorFormProps {
  sectionId: string;
  instanceId: string;
  sectionSchema: SectionSchema;
  content: { [key: string]: any };
  onContentChange: (instanceId: string, updatedContent: any) => void;
}

const SectionEditorForm: React.FC<SectionEditorFormProps> = ({
  instanceId,
  sectionSchema,
  content,
  onContentChange,
}) => {
  if (!sectionSchema || !sectionSchema.allFields) {
    return (
      <p className="text-gray-600">No editable fields for this section.</p>
    );
  }

  const handleInputChange = (fieldId: string, value: any) => {
    const updatedContent = {
      ...content,
      [fieldId]: value,
    };
    onContentChange(instanceId, updatedContent);
  };

  const handleArrayItemChange = (
    arrayFieldId: string,
    itemIndex: number,
    subFieldId: string,
    value: any
  ) => {
    const currentArray = content[arrayFieldId] || [];
    const updatedArray = [...currentArray];
    updatedArray[itemIndex] = {
      ...updatedArray[itemIndex],
      [subFieldId]: value,
    };
    onContentChange(instanceId, { ...content, [arrayFieldId]: updatedArray });
  };

  return (
    <div className="mt-4 space-y-3 w-full">
      {sectionSchema.allFields.map((field: FieldDefinition) => (
        <div key={field.id} className="mb-4">
          <label className="text-sm text-gray-700 block mb-1">
            {field.label}
          </label>
          {field.type === "text" && (
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600"
              value={
                content[field.id] !== undefined
                  ? String(content[field.id])
                  : field.default || ""
              }
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          )}
          {field.type === "textarea" && (
            <textarea
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 h-20"
              value={
                content[field.id] !== undefined
                  ? String(content[field.id])
                  : field.default || ""
              }
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          )}
          {field.type === "select" && (
            <select
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600"
              value={
                content[field.id] !== undefined
                  ? String(content[field.id])
                  : field.default || ""
              }
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {field.type === "image" && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600"
                value={
                  content[field.id] !== undefined
                    ? String(content[field.id])
                    : field.default || ""
                }
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder="Enter image URL"
              />
              <Image
                src={content[field.id] || field.default}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
                width={50}
                height={50}
              />
            </div>
          )}
        </div>
      ))}

      {/* Dynamic handling for 'columns' array (similar for 'images') */}
      {/* Note: This assumes 'columns' array structure is consistent across column sections */}
    </div>
  );
};

export default SectionEditorForm;
