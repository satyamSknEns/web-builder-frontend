"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSettings, FiGrid } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { BsDatabaseAdd } from "react-icons/bs";
import axios, { AxiosRequestConfig } from "axios";
import { apiUrl } from "../config";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

const WebEditor = () => {
  const [activeTab, setActiveTab] = useState<
    "settings" | "content" | "components"
  >("content");
  const [showSectionPopup, setShowSectionPopup] = useState(false);
  const [addedSections, setAddedSections] = useState<string[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [allSections, setAllSections] = useState<string[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getAllSections();
  }, []);

  const formatSectionLabel = (id: string) => {
    const formatedSection = id
      .replace(/_/g, " ")
      .replace(/\bsections\b/i, "")
      .trim();
    return formatedSection.charAt(0).toUpperCase() + formatedSection.slice(1);
  };

  const handleAddSection = (sectionId: string) => {
    setAddedSections([...addedSections, sectionId]);
    setShowSectionPopup(false);
    setHoveredSection(null);
    setSelectedSection(null);
  };

  const togglePopup = () => {
    setShowSectionPopup((prev) => {
      const newState = !prev;
      if (!newState) {
        setHoveredSection(null);
        setSelectedSection(null);
      }
      return newState;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setHoveredSection(null);
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

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const newSections = Array.from(addedSections);
    const [movedItem] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, movedItem);
    setAddedSections(newSections);
  };

  const renderSectionPreview = (sectionId: string) => {
    switch (sectionId) {
      case "image_text_sections":
        return (
          <div className="flex flex-col border border-slate-400 rounded-md overflow-hidden shadow bg-white mb-4">
            <div className="flex items-center justify-between p-2">
              <div className="w-1/2 p-4 bg-gray-100 text-center text-sm">
                Image Placeholder
              </div>
              <div className="w-1/2 p-4">
                <p className="font-semibold mb-2 text-sm">Heading</p>
                <p className="text-gray-600 text-xs">
                  This is a description for the image with text section.
                </p>
              </div>
            </div>
          </div>
        );
      case "gallery_sections":
        return (
          <div className="flex flex-col border border-slate-400 bg-gray-100 text-center mb-4 rounded w-full">
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
      case "multi_column_sections":
        return (
          <div className="flex items-center border border-slate-400 rounded-lg w-full bg-white">
            <div className="flex items-center justify-center gap-2 border-blue-300 w-full p-2">
              <div className="h-24 w-24 rounded-md flex items-center justify-center bg-gray-100">
                Image 1
              </div>
              <div className="h-24 w-24 rounded-md flex items-center justify-center bg-gray-100">
                Image 2
              </div>
              <div className="h-24 w-24 rounded-md flex items-center justify-center bg-gray-100">
                Image 3
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex text-black w-full overflow-hidden">
      <div
        ref={sidebarRef}
        className="w-[20%] flex items-start bg-white py-4 relative"
      >
        <div className="flex items-center flex-col gap-4 border-r-[1px] p-2 border-slate-200 w-[25%] h-full">
          {["content", "components", "settings"].map((tab) => (
            <button
              key={tab}
              className={`flex items-center justify-center gap-2 cursor-pointer outline-none rounded-md max-w-8 max-h-8 ${
                activeTab === tab ? "bg-gray-200 shadow" : "hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === "content" ? (
                <BsDatabaseAdd className="m-2" />
              ) : tab === "components" ? (
                <FiGrid className="m-2" />
              ) : (
                <FiSettings className="m-2" />
              )}
            </button>
          ))}
        </div>

        <div className="w-[75%] px-2 flex h-full mx-auto ">
          {activeTab === "content" && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sidebar-section-list">
                {(provided) => (
                  <div
                    className="w-full flex items-center flex-col justify-between"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div className="flex flex-col mt-8 w-full text-xs">
                      {addedSections.length === 0 ? (
                        <p className="text-gray-400 p-2">
                          No sections added yet.
                        </p>
                      ) : (
                        addedSections.map((section, index) => (
                          <Draggable
                            key={`${section}-${index}`}
                            draggableId={`sidebar-${section}-${index}`}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center gap-2 w-full p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                  snapshot.isDragging
                                    ? "bg-gray-200 shadow"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                <span className="text-gray-500">☰</span>
                                <span>{formatSectionLabel(section)}</span>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                    <div
                      className="flex w-full hover:bg-gray-200 cursor-pointer rounded-lg transition-all ease-in-out duration-300 border border-slate-200"
                      onClick={togglePopup}
                    >
                      <button className="flex items-center text-sm cursor-pointer outline-none gap-2 px-2 py-1.5 text-blue-700 rounded">
                        <GoPlusCircle />
                        Add section
                      </button>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          {activeTab === "settings" && (
            <p className="text-gray-600">Settings content goes here...</p>
          )}
          {activeTab === "components" && (
            <p className="text-gray-600">Component content goes here...</p>
          )}
        </div>

        {activeTab === "content" && showSectionPopup && (
          <div
            ref={popupRef}
            className={`mt-4 rounded-lg border-blue-400 shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:w-[600px] h-[360px] overflow-y-hidden flex z-10 absolute left-full bottom-1 right-0  ${
              activeTab === "content" && showSectionPopup ? "slide-top" : ""
            }`}
          >
            <div className="overflow-y-scroll h-full w-[35%] bg-white p-2">
              <input
                type="search"
                placeholder="Search"
                className="w-full border border-slate-300 rounded-lg py-1.5 px-2 text-gray-600 text-sm outline-none focus:border-slate-500 transition-all"
              />
              <h4 className="text-sm font-semibold text-gray-700 my-3">
                Sections
              </h4>
              <ul className="space-y-1">
                {allSections.map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => handleAddSection(section)}
                      onMouseEnter={() => setHoveredSection(section)}
                      className="w-full text-left px-3 py-1 text-sm rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                      {formatSectionLabel(section)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-r-lg bg-gray-200 w-[65%] flex justify-center items-center p-6 overflow-y-auto h-full cursor-pointer"
              onClick={() => hoveredSection && handleAddSection(hoveredSection)}
            >
              {hoveredSection ? (
                renderSectionPreview(hoveredSection)
              ) : (
                <p className="text-gray-500">
                  Select or hover over a section to preview.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-[80%] p-2 bg-gray-100">
        {addedSections.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No sections added yet. Click &quot;Add section&quot; to get started.
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="section-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4 h-full border border-blue-100 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2 bg-white overflow-y-auto"
                >
                  {addedSections.map((sectionId, index) => (
                    <Draggable
                      key={`${sectionId}-${index}`}
                      draggableId={`${sectionId}-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`rounded ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          }`}
                        >
                          {renderSectionPreview(sectionId)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default WebEditor;
