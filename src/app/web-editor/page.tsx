"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSettings, FiGrid, FiPlus } from "react-icons/fi";
import { BsDatabaseAdd } from "react-icons/bs";

const sectionOptions = [
  { id: "imageWithText", label: "Image with Text" },
  { id: "image", label: "Image" },
  { id: "headingDesc", label: "Heading and Description" },
  { id: "imageCollection", label: "Collection of Images" },
];

const WebEditor = () => {
  const [activeTab, setActiveTab] = useState<"settings" | "content" | "components">("content");
  const [showSectionPopup, setShowSectionPopup] = useState(false);
  const [addedSections, setAddedSections] = useState<string[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null); 

  const handleAddSection = (sectionId: string) => {
    setAddedSections([...addedSections, sectionId]);
    setShowSectionPopup(false);
    setSelectedSection(null); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowSectionPopup(false);
        setSelectedSection(null); 
      }
    };

    if (showSectionPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSectionPopup]);

  const renderSectionPreview = (sectionId: string) => {
    switch (sectionId) {
      case "imageWithText":
        return (
          <div className="flex flex-col border rounded-md overflow-hidden shadow bg-white mb-4">
            <div className="flex">
              <div className="w-1/2 p-4 bg-gray-100 text-center">
                Image Placeholder
              </div>
              <div className="w-1/2 p-4">
                <h3 className="text-xl font-semibold mb-2">Heading</h3>
                <p className="text-gray-600">
                  This is a description for the image with text section.
                </p>
              </div>
            </div>
           
          </div>
        );
      case "image":
        return (
          <div className="flex flex-col bg-gray-100 text-center mb-4 rounded">
            <div className="p-6">Image Section</div>
            
          </div>
        );
      case "headingDesc":
        return (
          <div className="flex flex-col p-4 bg-white rounded shadow mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Heading</h3>
              <p className="text-gray-600">
                This is a paragraph with description.
              </p>
            </div>
           
          </div>
        );
      case "imageCollection":
        return (
          <div className="flex flex-col mb-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="h-24 bg-gray-200 rounded">Image 1</div>
              <div className="h-24 bg-gray-200 rounded">Image 2</div>
              <div className="h-24 bg-gray-200 rounded">Image 3</div>
            </div>
          
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex text-black">
      <div className="w-[30%] flex items-start border-r bg-white py-4">
        <div className="flex flex-col gap-4 items-start border-r-[1px] p-2 border-slate-200 w-[15%] h-full">
          <button
            className={`flex items-center justify-center gap-2 p-3 cursor-pointer outline-none rounded-md w-full ${
              activeTab === "content" ? "bg-gray-200 shadow" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("content")}
          >
            <BsDatabaseAdd />
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-3 cursor-pointer outline-none rounded-md w-full ${
              activeTab === "components" ? "bg-gray-200 shadow" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("components")}
          >
            <FiGrid />
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-3 cursor-pointer outline-none rounded-md w-full ${
              activeTab === "settings" ? "bg-gray-200 shadow" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <FiSettings />
          </button>
        </div>

        <div className="w-[85%] px-2 mt-8 relative">
          {activeTab === "content" && (
            <div>
              <button
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowSectionPopup(true)}
              >
                <FiPlus /> Add a section
              </button>

              {showSectionPopup && (
                <div
                  ref={popupRef}
                  className="mt-4 bg-white shadow-md rounded-lg p-2 border border-gray-400 absolute top-1/2 left-[310px] overflow-y-scroll flex h-96 w-[700px]"
                >
                  <div className="overflow-y-scroll h-full w-[35%]">
                    <div className="rounded-lg">
                      <input
                        type="search"
                        placeholder="Search"
                        className="w-full border rounded-lg py-1 text-center"
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 my-3">Sections</h4>
                    <ul className="space-y-1">
                      {sectionOptions.map((section) => (
                        <li key={section.id}>
                          <button
                            onClick={() => setSelectedSection(section.id)} // Set preview on click
                            onMouseEnter={() => setHoveredSection(section.id)}
                            onMouseLeave={() => setHoveredSection(null)}
                            className="w-full flex items-center text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                          >
                            <span className="text-sm">{section.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-gray-200 w-[65%] flex justify-center items-center p-6 overflow-y-auto h-full">
                    {selectedSection || hoveredSection ? (
                      renderSectionPreview(selectedSection || hoveredSection!)
                    ) : (
                      <p className="text-gray-500">
                        Select or hover over a section to preview.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <p className="text-gray-600">Settings content goes here...</p>
          )}

          {activeTab === "components" && (
            <p className="text-gray-600">Component content goes here...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebEditor;