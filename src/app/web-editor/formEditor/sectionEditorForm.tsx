import Image from "next/image";
import React, { useRef, useCallback, useState, useEffect } from "react";

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
  allFields: FieldDefinition[];
  max_items?: number;
}

interface SectionEditorFormProps {
  sectionId: string;
  instanceId: string;
  sectionSchema: SectionSchema;
  content: { [key: string]: any };
  onContentChange: (instanceId: string, updatedContent: any) => void;
}

interface ImageInputFieldProps {
  id: string;
  label: string;
  displayValue: string;
  onValueChange: (value: string) => void;
  uniqueHtmlId: string;
}

const ImageInputField: React.FC<ImageInputFieldProps> = ({
  id,
  label,
  displayValue,
  onValueChange,
  uniqueHtmlId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string>(displayValue || "");

  useEffect(() => {
    setPreviewUrl(displayValue || "");
  }, [displayValue]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        onValueChange(objectUrl);
      }
    },
    [onValueChange]
  );

  return (
    <div className="flex items-center space-x-2 w-full">
      <input
        type="file"
        id={uniqueHtmlId}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <div className="relative w-full overflow-hidden rounded-lg group">
          <Image
            src={previewUrl}
            alt={`Preview for ${label}`}
            width={100}
            height={100}
            className="w-full h-auto object-cover rounded-lg border border-slate-200"
            style={{ maxHeight: "100px" }}
          />

          <div
            className="absolute inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Image
            <div className="absolute top-2 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          {" "}
          <button
            type="button"
            className="flex-shrink-0 text-black bg-[#f1f1f1] hover:bg-[#ebebeb] text-sm px-4 py-2 mr-0.5 rounded-tl-md rounded-bl-md transition-colors focus:outline-none cursor-pointer outline-none"
            onClick={() => fileInputRef.current?.click()}
          >
            Select
          </button>
          <button
            type="button"
            className="flex-shrink-0 text-gray-500 bg-[#f1f1f1] hover:bg-[#ebebeb] hover:text-gray-700 p-2 rounded-tr-md rounded-br-md transition-colors focus:outline-none cursor-pointer outline-none"
            onClick={() => fileInputRef.current?.click()}
            title="Select image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const SectionEditorForm: React.FC<SectionEditorFormProps> = ({
  instanceId,
  sectionSchema,
  content,
  onContentChange,
}) => {
  const handleInputChange = useCallback(
    (fieldId: string, value: any) => {
      const updatedContent = {
        ...content,
        [fieldId]: value,
      };
      onContentChange(instanceId, updatedContent);
    },
    [content, instanceId, onContentChange]
  );

  const handleArrayItemChange = useCallback(
    (
      arrayFieldId: string,
      itemIndex: number,
      subFieldId: string,
      value: any
    ) => {
      const currentArray = content[arrayFieldId] || [];
      const updatedArray = [...currentArray];

      if (!updatedArray[itemIndex]) {
        updatedArray[itemIndex] = {};
      }

      updatedArray[itemIndex] = {
        ...updatedArray[itemIndex],
        [subFieldId]: value,
      };
      onContentChange(instanceId, { ...content, [arrayFieldId]: updatedArray });
    },
    [content, instanceId, onContentChange]
  );

  const renderField = useCallback(
    (
      field: FieldDefinition,
      currentContent: { [key: string]: any },
      prefixId: string = ""
    ) => {
      const uniqueId = `${prefixId}${field.id}`;
      const fieldValue = currentContent[field.id];
      const displayValue =
        fieldValue !== undefined
          ? String(fieldValue)
          : String(field.default || "");

      switch (field.type) {
        case "text":
        case "url":
          return (
            <input
              type={field.type === "url" ? "url" : "text"}
              id={uniqueId}
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              value={displayValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.label}
            />
          );
        case "textarea":
          return (
            <textarea
              id={uniqueId}
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              rows={6}
              value={displayValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.label}
            />
          );
        case "select":
          return (
            <select
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              id={uniqueId}
              value={displayValue}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        case "image":
          return (
            <ImageInputField
              id={field.id}
              label={field.label}
              displayValue={displayValue}
              onValueChange={(value) => handleInputChange(field.id, value)}
              uniqueHtmlId={uniqueId}
            />
          );
        case "number":
          return (
            <input
              type="number"
              id={uniqueId}
              className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
              value={displayValue}
              onChange={(e) =>
                handleInputChange(field.id, Number(e.target.value))
              }
              placeholder={field.label}
            />
          );
        default:
          return (
            <p className="text-red-500">Unknown field type: {field.type}</p>
          );
      }
    },
    [handleInputChange]
  );

  if (!sectionSchema || !sectionSchema.allFields) {
    return (
      <p className="text-gray-600">No editable fields for this section.</p>
    );
  }

  return (
    <div className="mt-4 space-y-3 w-full">
      {sectionSchema.allFields.map((field: FieldDefinition) => {
        if (field.type === "array" && field.itemFields) {
          const numItemsToRender =
            field.maxItems || sectionSchema.max_items || 1;
          const currentArrayContent = (content[field.id] || []).slice(
            0,
            numItemsToRender
          );

          while (currentArrayContent.length < numItemsToRender) {
            currentArrayContent.push({});
          }

          return (
            <div
              key={field.id}
              className="border border-slate-300 rounded-lg p-3 my-4 bg-gray-50"
            >
              <h4 className="font-semibold mb-3 text-gray-800 text-sm">
                {field.label}
              </h4>
              {currentArrayContent.map(
                (itemContent: { [key: string]: any }, itemIndex: number) => {
                  return (
                    <div
                      key={`${field.id}-${itemIndex}`}
                      className="mb-4 p-3 border border-slate-200 rounded-md bg-white shadow-sm"
                    >
                      <h5 className="font-medium mb-2 text-gray-700 text-sm">
                        {field.name || "Item"} {itemIndex + 1}
                      </h5>
                      {field.itemFields &&
                        field?.itemFields.map((subField: FieldDefinition) => {
                          const subUniqueId = `${instanceId}-${field.id}-${itemIndex}-${subField.id}`;
                          const subFieldValue = itemContent[subField.id];
                          const subDisplayValue =
                            subFieldValue !== undefined
                              ? String(subFieldValue)
                              : String(subField.default || "");

                          return (
                            <div key={subUniqueId} className="mb-3">
                              <label
                                htmlFor={subUniqueId}
                                className="text-xs text-gray-600 block mb-1"
                              >
                                {subField.label}
                                {subField.info && (
                                  <span className="ml-1 text-gray-400 text-[10px]">
                                    ({subField.info})
                                  </span>
                                )}
                              </label>
                              {(() => {
                                switch (subField.type) {
                                  case "text":
                                  case "url":
                                    return (
                                      <input
                                        type={ subField.type === "url" ? "url" : "text" }
                                        id={subUniqueId}
                                        className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
                                        value={subDisplayValue}
                                        onChange={(e) =>
                                          handleArrayItemChange(
                                            field.id,
                                            itemIndex,
                                            subField.id,
                                            e.target.value
                                          )
                                        }
                                        placeholder={subField.label}
                                      />
                                    );
                                  case "textarea":
                                    return (
                                      <textarea
                                        id={subUniqueId}
                                        className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 h-16 outline-none focus:border-slate-500 transition-all text-sm"
                                        value={subDisplayValue}
                                        onChange={(e) =>
                                          handleArrayItemChange(
                                            field.id,
                                            itemIndex,
                                            subField.id,
                                            e.target.value
                                          )
                                        }
                                        placeholder={subField.label}
                                      />
                                    );
                                  case "select":
                                    return (
                                      <select
                                        id={subUniqueId}
                                        className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
                                        value={subDisplayValue}
                                        onChange={(e) =>
                                          handleArrayItemChange(
                                            field.id,
                                            itemIndex,
                                            subField.id,
                                            e.target.value
                                          )
                                        }
                                      >
                                        {subField.options?.map((option) => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                    );
                                  case "image":
                                    return (
                                      <ImageInputField
                                        id={subField.id}
                                        label={subField.label}
                                        displayValue={subDisplayValue}
                                        onValueChange={(value) =>
                                          handleArrayItemChange(
                                            field.id,
                                            itemIndex,
                                            subField.id,
                                            value
                                          )
                                        }
                                        uniqueHtmlId={subUniqueId}
                                      />
                                    );
                                  case "number":
                                    return (
                                      <input
                                        type="number"
                                        id={subUniqueId}
                                        className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 outline-none focus:border-slate-500 transition-all text-sm"
                                        value={subDisplayValue}
                                        onChange={(e) =>
                                          handleArrayItemChange(
                                            field.id,
                                            itemIndex,
                                            subField.id,
                                            Number(e.target.value)
                                          )
                                        }
                                        placeholder={subField.label}
                                      />
                                    );
                                  default:
                                    return (
                                      <p className="text-red-500 text-xs">
                                        Unknown sub-field type: {subField.type}
                                      </p>
                                    );
                                }
                              })()}
                            </div>
                          );
                        })}
                    </div>
                  );
                }
              )}
            </div>
          );
        } else {
          return (
            <div key={field.id} className="mb-4">
              <label
                htmlFor={`${instanceId}-${field.id}`}
                className="text-sm text-gray-700 block mb-1"
              >
                {field.label}
                {field.info && (
                  <span className="ml-1 text-gray-400 text-xs">
                    ({field.info})
                  </span>
                )}
              </label>
              {renderField(field, content, `${instanceId}-`)}
            </div>
          );
        }
      })}
    </div>
  );
};

export default SectionEditorForm;
