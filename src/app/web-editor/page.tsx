"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, } from "@hello-pangea/dnd";
import { FiSettings, FiGrid, FiTrash2, FiEyeOff, FiEye, FiRotateCcw, FiRotateCw,FiColumns } from "react-icons/fi";
import { GrColumns } from "react-icons/gr";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { LuColumns3 } from "react-icons/lu";
import { GrGallery } from "react-icons/gr";
import { BsDatabaseAdd, BsImages } from "react-icons/bs";
import { GoPlusCircle } from "react-icons/go";
import { RxDragHandleDots2 } from "react-icons/rx";
import axios, { AxiosRequestConfig } from "axios";
import sectionsData from "../../../section.json";
import { apiUrl } from "../config";
import { ImageTextPreview, GalleryPreview, ColumnsPreview, } from "../components/sectionPreviews";
import Header from "./header/Header";

interface AddedSection {
  id: string;
  sectionId: string;
}

interface EditorState {
  addedSections: AddedSection[];
  hiddenSections: string[];
}

const WebEditor = () => {
  const [activeTab, setActiveTab] = useState<
    "settings" | "content" | "components"
  >("content");
  const [showSectionPopup, setShowSectionPopup] = useState(false);
  const [addedSections, setAddedSections] = useState<AddedSection[]>([]);
  const [hiddenSections, setHiddenSections] = useState<string[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [hoveredSubSection, setHoveredSubSection] = useState<string | null>(
    null
  );
  const [allSections, setAllSections] = useState<string[]>([]);
  const [undoStack, setUndoStack] = useState<EditorState[]>([]);
  const [redoStack, setRedoStack] = useState<EditorState[]>([]);
  const [pages] = useState(["Home", "About", "Contact"]); 
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const uniqueIdRef = React.useRef(0);
  const generateUniqueId = () => {
    uniqueIdRef.current += 1;
    return `added-section-${uniqueIdRef.current}`;
  };

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

  const pushToUndoStack = (prevState: EditorState) => {
    setUndoStack((prev) => [...prev, prevState]);
    setRedoStack([]);
  };

  const currentEditorState = (): EditorState => ({ addedSections, hiddenSections, });

  const handleAddSection = (sectionId: string) => {
    const newAddedSection: AddedSection = {
      id: generateUniqueId(),
      sectionId,
    };
    pushToUndoStack(currentEditorState());
    setAddedSections([...addedSections, newAddedSection]);
    setShowSectionPopup(false);
    setHoveredSection(null);
  };
  console.log("addedSections",addedSections)

  const handleDeleteSection = (instanceId: string) => {
    pushToUndoStack(currentEditorState());
    setAddedSections((prev) =>
      prev.filter((section) => section.id !== instanceId)
    );
    setHiddenSections((prev) => prev.filter((id) => id !== instanceId));
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const ignoreNextClick = useRef(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (buttonRef.current?.contains(target)) {
        ignoreNextClick.current = true;
        return;
      }

      if (popupRef.current && !popupRef.current.contains(target)) {
        setShowSectionPopup(false);
        setHoveredSection(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSectionPopup((prev) => !prev);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    pushToUndoStack(currentEditorState());
    const newSections = Array.from(addedSections);
    const [movedItem] = newSections.splice(source.index, 1);
    newSections.splice(destination.index, 0, movedItem);
    setAddedSections(newSections);
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderSectionPreview = (sectionId: string) => {
    switch (sectionId) {
      case "image_text_section":
        return <ImageTextPreview />;
      case "2_column_section":
        return <ColumnsPreview heading="2 Columns" />;
      case "3_column_section":
        return <ColumnsPreview heading="3 Columns" />;
      case "4_column_section":
        return <ColumnsPreview heading="4 Columns" />;
      case "gallery_sections":
        return <GalleryPreview />;
      default:
        return null;
    }
  };

  const sectionIcon = (section: string) => {
    switch (section) {
      case "image_text_section":
        return <BsImages />;
      case "2_column_section":
        return <FiColumns />;
      case "3_column_section":
        return <LuColumns3 />;
      case "4_column_section":
        return <GrColumns />;
      case "gallery_sections":
        return <GrGallery />;
      default:
        return null;
    }
  };

  const handleHideSection = (instanceId: string) => {
    pushToUndoStack(currentEditorState());
    if (hiddenSections.includes(instanceId)) {
      setHiddenSections(hiddenSections.filter((id) => id !== instanceId));
    } else {
      setHiddenSections([...hiddenSections, instanceId]);
    }
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, currentEditorState()]);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));

    setAddedSections(previousState.addedSections);
    setHiddenSections(previousState.hiddenSections);
  }, [undoStack, currentEditorState]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, currentEditorState()]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));

    setAddedSections(nextState.addedSections);
    setHiddenSections(nextState.hiddenSections);
  }, [redoStack, currentEditorState]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.isContentEditable ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleUndo, handleRedo]);

  const handleSave = () => {
    console.log("Save clicked");
  };

  return (
    <div className="h-screen flex flex-col text-black w-full overflow-hidden">
      <Header
        pages={pages}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        undoStack={undoStack}
        redoStack={redoStack}
      />
      <div className="flex item-center justify-center h-[90vh]">
        <div
        ref={sidebarRef}
        className="w-[25%] flex items-start bg-white py-4 relative"
      >
        <div className="flex items-center flex-col gap-4 border-r-[1px] p-2 border-slate-200 w-[25%] h-full">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className={`flex items-center justify-center gap-1 rounded-md p-1 max-w-8 max-h-8 ${
              undoStack.length === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-200 cursor-pointer"
            }`}
          >
            <FiRotateCcw className="m-1" size={20} />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
            className={`flex items-center justify-center gap-1 rounded-md p-1 max-w-8 max-h-8 ${
              redoStack.length === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-200 cursor-pointer"
            }`}
          >
            <FiRotateCw className="m-1" size={20} />
          </button>

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
                        addedSections.map(({ id, sectionId }, index) => {
                          const isHidden = hiddenSections.includes(id);
                          return (
                            <Draggable
                              key={`${id}-${index}`}
                              draggableId={`sidebar-${id}-${index}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`flex items-center justify-between gap-2 w-full p-2 rounded-lg cursor-pointer border my-1 border-slate-300 transition-all duration-300 group ${
                                    snapshot.isDragging
                                      ? "bg-gray-200 shadow"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center justify-center">
                                    <span className="text-gray-500 block group-hover:hidden">
                                      {" "}
                                      {sectionIcon(sectionId)}{" "}
                                    </span>
                                    <span className="text-gray-500 hidden group-hover:block">
                                      {" "}
                                      <RxDragHandleDots2 />{" "}
                                    </span>
                                    <span className="cursor-pointer ml-1">
                                      {formatSectionLabel(sectionId)}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-center cursor-pointer">
                                    <button
                                      onClick={() => handleDeleteSection(id)}
                                      className="hidden group-hover:block text-slate-500 hover:text-red-700 ml-auto cursor-pointer"
                                      aria-label="Delete section"
                                      title="Delete section"
                                      type="button"
                                    >
                                      <FiTrash2 size={15} />
                                    </button>

                                    <button
                                      onClick={() => handleHideSection(id)}
                                      className={`ml-2 cursor-pointer group-hover:block hover:bg-gray-100 ${
                                        isHidden
                                          ? "block text-gray-400 hover:text-gray-600"
                                          : "hidden text-gray-500 hover:text-gray-700"
                                      }`}
                                      aria-label={
                                        isHidden
                                          ? "Show section"
                                          : "Hide section"
                                      }
                                      title={
                                        isHidden
                                          ? "Show section"
                                          : "Hide section"
                                      }
                                      type="button"
                                    >
                                      {isHidden ? (
                                        <FiEyeOff size={15} />
                                      ) : (
                                        <FiEye size={15} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                      <button
                        className="w-full hover:bg-gray-200 rounded-lg transition-all ease-in-out duration-300 border border-slate-200 flex items-center text-sm cursor-pointer outline-none gap-2 px-2 py-1.5 text-blue-700"
                        ref={buttonRef}
                        onClick={togglePopup}
                      >
                        <GoPlusCircle />
                        Add section
                      </button>
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
            onClick={(e) => e.stopPropagation()}
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
                {Object.entries(sectionsData).map(([key, value]) => {
                  const isOpen = openSections[key] || false;
                  const isExpandable = Array.isArray(value) && value.length > 1;

                  return (
                    <li key={key}>
                      <button
                        onClick={() =>
                          isExpandable
                            ? toggleSection(key)
                            : handleAddSection(key)
                        }
                        onMouseEnter={() => setHoveredSection(key)}
                        className="w-full text-left px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 flex justify-start items-center cursor-pointer outline-none"
                      >
                        <span className="w-4 h-4">{sectionIcon(key)}</span>{" "}
                        <div className="flex items-center justify-between w-full">
                          <span className="ml-2">
                            {formatSectionLabel(key)}
                          </span>
                          {isExpandable && (
                            <span>
                              {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </span>
                          )}
                        </div>
                      </button>

                      {isOpen && isExpandable && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {(value as any[]).map((item) => (
                            <li key={item.sectionId} className="cursor-pointer">
                              <button
                                onClick={() => handleAddSection(item.heading)}
                                onMouseEnter={() =>
                                  setHoveredSubSection(item.heading)
                                }
                                className="w-full text-left px-3 py-1 text-sm rounded-md text-gray-500 hover:bg-gray-200 cursor-pointer"
                              >
                                {item.heading}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
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

      <div className="w-[75%] p-2 bg-gray-100">
        {addedSections.filter(({ id }) => !hiddenSections.includes(id))
          .length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No sections to display. You may have hidden all sections.
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
                  {addedSections.map(({ id, sectionId }, index) => {
                    const isHidden = hiddenSections.includes(id);
                    return (
                      <Draggable
                        key={`${id}-${index}`}
                        draggableId={`${id}-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              display: isHidden ? "none" : undefined,
                              ...provided.draggableProps.style,
                            }}
                            className={`rounded ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            }`}
                          >
                            {renderSectionPreview(sectionId)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      </div>
    </div>
  );
};

export default WebEditor;
