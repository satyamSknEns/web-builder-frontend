"use client";

import React, { useEffect, useState } from "react";
import { FiSettings, FiFileText, FiGrid, FiPlus } from "react-icons/fi";
import { BsDatabaseAdd } from "react-icons/bs";
import { apiUrl } from "../config";
import axios, { AxiosRequestConfig } from "axios";

const sectionOptions = [
  { id: "imageWithText", label: "Image with Text" },
  { id: "image", label: "Image" },
  { id: "headingDesc", label: "Heading and Description" },
  { id: "imageCollection", label: "Collection of Images" },
];

const WebEditor = () => {
  const [activeTab, setActiveTab] = useState<
    "settings" | "content" | "components"
  >("content");
  const [showSectionPopup, setShowSectionPopup] = useState(false);
  const [addedSections, setAddedSections] = useState<string[]>([]);
  const [allSections, setAllSections] = useState<string[]>([]);

  const getAllSections = async () => {
    const config: AxiosRequestConfig = {
      url: `${apiUrl}/section-list`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios(config);
      if (res?.status === 200) {
        setAllSections(res.data.data);
      }
      console.log("res__", res);
    } catch (error) {
      console.log("Error", error);
    }
  };

  console.log("allSections", allSections);

  useEffect(() => {
    getAllSections();
  }, []);

  const formatSectionLabel = (id: string) => {
    return id
      .replace(/_/g, " ")
      .replace(/\bsections\b/i, "")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  const handleAddSection = (sectionId: string) => {
    setAddedSections([...addedSections, sectionId]);
    setShowSectionPopup(false);
  };

  const renderSectionPreview = (sectionId: string) => {
    switch (sectionId) {
      case "imageWithText":
        return (
          <div className="flex border rounded-md overflow-hidden shadow bg-white mb-4">
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
        );
      case "image":
        return (
          <div className="bg-gray-100 text-center p-6 mb-4 rounded">
            Image Section
          </div>
        );
      case "headingDesc":
        return (
          <div className="p-4 bg-white rounded shadow mb-4">
            <h3 className="text-xl font-bold mb-2">Heading</h3>
            <p className="text-gray-600">
              This is a paragraph with description.
            </p>
          </div>
        );
      case "imageCollection":
        return (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="h-24 bg-gray-200 rounded">Image 1</div>
            <div className="h-24 bg-gray-200 rounded">Image 2</div>
            <div className="h-24 bg-gray-200 rounded">Image 3</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex  text-black">
      <div className="w-[25%] flex items-start border-r bg-white py-4 relative">
        <div className="flex flex-col gap-4 items-start border-r-[1px] p-2 border-slate-200 w-[15%] h-full">
          <button
            className={`flex items-center justify-center gap-2 p-3 cursor-pointer outline-none rounded-md w-full ${
              activeTab === "content"
                ? "bg-gray-200 shadow"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("content")}
          >
            <BsDatabaseAdd />
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-3 cursor-pointer outline-none rounded-md w-full ${
              activeTab === "components"
                ? "bg-gray-200 shadow"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("components")}
          >
            <FiGrid />
          </button>
          <button
            className={`flex items-center justify-center gap-2 p-3 cursor-pointer outline-none rounded-md w-full ${
              activeTab === "settings"
                ? "bg-gray-200 shadow"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <FiSettings />
          </button>
        </div>

        <div className="w-[85%] px-2 mt-8">
          {activeTab === "content" && (
            <button
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowSectionPopup((prev) => !prev)}
            >
              <FiPlus /> Add a section
            </button>
          )}

          {activeTab === "settings" && (
            <p className="text-gray-600">Settings content goes here...</p>
          )}

          {activeTab === "components" && (
            <p className="text-gray-600">Component content goes here...</p>
          )}
        </div>
        {activeTab === "content" && showSectionPopup && (
          <div className="mt-4 bg-white shadow-md rounded p-4 absolute left-full bottom-2 w-64">
            <h4 className="font-semibold mb-2">Choose a section</h4>
            <ul className="space-y-2">
              {allSections.map((section) => (
                <li key={section}>
                  <button
                    onClick={() => handleAddSection(section)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    {formatSectionLabel(section)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-[75%] p-6 bg-gray-50 overflow-y-auto">
        {addedSections.length === 0 ? (
          <p className="text-gray-500">
            No sections added yet. Click &ldquo;Add a section&ldquo; to begin.
          </p>
        ) : (
          addedSections.map((sectionId, idx) => (
            <div key={idx}>{renderSectionPreview(sectionId)}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebEditor;
