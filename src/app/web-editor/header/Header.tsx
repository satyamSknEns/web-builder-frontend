import React, { useState, useEffect } from "react";
import { FiRotateCcw, FiRotateCw, FiSave } from "react-icons/fi";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import { MdTabletMac } from "react-icons/md";
import Tooltip from "../../components/Tooltip";

const Header = ({
  pages,
  selectedPage,
  onSelectPage,
  onUndo,
  onRedo,
  onSave,
  undoStack,
  redoStack,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPages = pages.filter((page: string) =>
    page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave]);

  const ctrlKey = (
    <span className="px-1 py-0.5 bg-gray-100 text-slate-600 text-[12px] rounded-md mx-1">CTRL</span>
  );

  const tooltipContent = (type:any) => {
    let content:any;

    switch (type) {
      case "save":
        content = (
          <>
            {ctrlKey}
            <span className="px-2 py-0.5 bg-gray-100 text-slate-600 text-xs rounded-md mx-1">S</span>
          </>
        );
        break;
      case "undo":
        content = (
          <>
            {ctrlKey}
            <span className="px-2 py-0.5 bg-gray-100 text-slate-600 text-xs rounded-md mx-1">Z</span>
          </>
        );
        break;
      case "redo":
        content = (
          <>
            {ctrlKey}
            <span className="px-2 py-0.5 bg-gray-100 text-slate-600 text-xs rounded-md mx-1">Y</span>
          </>
        );
        break;
      case "desktop":
        content = <span>Desktop</span>;
        break;
      case "tablet":
        content = <span>Tablet</span>;
        break;
      case "mobile":
        content = <span>Mobile</span>;
        break;
      default:
        return null; 
    }

    return (
      <div className="flex items-center justify-center px-2 py-0.5 bg-white text-xs">
        <p className="flex items-center">{content}</p>
      </div>
    );
  };


  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md h-[10vh]">
      <h1 className="text-xl font-bold">Editor</h1>

      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <select
          value={selectedPage}
          onChange={(e) => onSelectPage(e.target.value)}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        >
          {filteredPages.map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <Tooltip message={() => tooltipContent("desktop")} position="bottom" width="auto" maxWidth="110px">
            <div className="w-6 h-6">
              <HiOutlineDesktopComputer size={20} className="cursor-pointer" />
            </div>
          </Tooltip>
          <Tooltip message={() => tooltipContent("tablet")} position="bottom" width="auto" maxWidth="110px">
            <div className="w-6 h-6">
              <MdTabletMac size={18} className="cursor-pointer" />
            </div>
          </Tooltip>
          <Tooltip message={() => tooltipContent("mobile")} position="bottom" width="auto" maxWidth="110px">
            <div className="w-6 h-6">
              <HiMiniDevicePhoneMobile size={20} className="cursor-pointer" />
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip message={() => tooltipContent("undo")} position="bottom" width="auto" maxWidth="100px">
            <button
              onClick={onUndo}
              disabled={undoStack.length === 0}
              aria-label="Undo"
              className={`flex items-center justify-center gap-1 rounded-md p-2 ${
                undoStack.length === 0 ? "opacity-40" : "hover:bg-gray-200 cursor-pointer"
              }`}
            >
              <FiRotateCcw size={20} />
            </button>
          </Tooltip>
          <Tooltip message={() => tooltipContent("redo")} position="bottom" width="auto" maxWidth="100px">
            <button
              onClick={onRedo}
              disabled={redoStack.length === 0}
              aria-label="Redo"
              className={`flex items-center justify-center gap-1 rounded-md p-2 ${
                redoStack.length === 0 ? "opacity-40" : "hover:bg-gray-200 cursor-pointer"
              }`}
            >
              <FiRotateCw size={20} />
            </button>
          </Tooltip>
          <Tooltip message={() => tooltipContent("save")} position="bottom" width="auto" maxWidth="100px">
            <button
              onClick={onSave}
              className={`px-3 py-1 text-sm font-semibold rounded-md ${
                undoStack.length === 0 ? "bg-gray-200 text-gray-600" : "bg-black text-white hover:bg-gray-800 cursor-pointer"
              }`}
              disabled={undoStack.length === 0}
            >
              Save
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Header;
