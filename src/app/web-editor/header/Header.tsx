import React, { useState, useEffect } from "react";
import { FiRotateCcw, FiRotateCw, FiSave } from "react-icons/fi";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { HiMiniDevicePhoneMobile } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { MdTabletMac } from "react-icons/md";
import Tooltip from "../../components/Tooltip";
import Link from "next/link";

interface HeaderProps {
  pages: string[];
  selectedPage: string;
  onSelectPage: (page: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  undoStack: any[];
  redoStack: any[];
}
const Header: React.FC<HeaderProps> = ({
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
  const [hovered, setHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <span className="px-1 py-0.5 bg-gray-100 text-slate-600 text-[12px] rounded-md mx-1">
      CTRL
    </span>
  );

  const tooltipContent = (type: any) => {
    let content: any;

    switch (type) {
      case "save":
        content = (
          <>
            {ctrlKey}
            <span className="px-2 py-0.5 bg-gray-100 text-slate-600 text-xs rounded-md mx-1">
              S
            </span>
          </>
        );
        break;
      case "undo":
        content = (
          <>
            {ctrlKey}
            <span className="px-2 py-0.5 bg-gray-100 text-slate-600 text-xs rounded-md mx-1">
              Z
            </span>
          </>
        );
        break;
      case "redo":
        content = (
          <>
            {ctrlKey}
            <span className="px-2 py-0.5 bg-gray-100 text-slate-600 text-xs rounded-md mx-1">
              Y
            </span>
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
      <div className="flex items-center w-[10%]">
        <div className="flex items-center">
          <div
            className="cursor-pointer flex items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Link href="/">
              <CiLogout className="text-lg mr-2" />
            </Link>
          </div>
          <span
            className={`text-sm ${hovered ? "slideRight" : "slideLeft ml-3"}`}
          >
            {hovered ? "Exit" : "Web Editor"}
          </span>
        </div>
      </div>

      <div className="relative w-1/3">
        <div
          className="flex items-center justify-between border border-gray-300 rounded-lg p-2 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="">{selectedPage || "Home"}</span>
          <IoIosArrowDown className="text-sm ml-2" />
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md z-50">
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
            />
            <ul className="max-h-60 overflow-y-auto">
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <li
                    key={page}
                    onClick={() => {
                      onSelectPage(page);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      selectedPage === page ? "bg-gray-200 font-semibold" : ""
                    }`}
                  >
                    {page}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No pages found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <Tooltip
            message={() => tooltipContent("desktop")}
            position="bottom"
            width="auto"
            maxWidth="110px"
            bg="bg-white"
          >
            <div className="w-6 h-6">
              <HiOutlineDesktopComputer size={20} className="cursor-pointer" />
            </div>
          </Tooltip>
          <Tooltip
            message={() => tooltipContent("tablet")}
            position="bottom"
            width="auto"
            maxWidth="110px"
            bg="bg-white"
          >
            <div className="w-6 h-6">
              <MdTabletMac size={18} className="cursor-pointer" />
            </div>
          </Tooltip>
          <Tooltip
            message={() => tooltipContent("mobile")}
            position="bottom"
            width="auto"
            maxWidth="110px"
            bg="bg-white"
          >
            <div className="w-6 h-6">
              <HiMiniDevicePhoneMobile size={20} className="cursor-pointer" />
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip
            message={() => tooltipContent("undo")}
            position="bottom"
            width="auto"
            maxWidth="100px"
            bg="bg-white"
          >
            <button
              onClick={onUndo}
              disabled={undoStack.length === 0}
              aria-label="Undo"
              className={`flex items-center justify-center gap-1 rounded-md p-2 ${
                undoStack.length === 0
                  ? "opacity-40"
                  : "hover:bg-gray-200 cursor-pointer"
              }`}
            >
              <FiRotateCcw size={20} />
            </button>
          </Tooltip>
          <Tooltip
            message={() => tooltipContent("redo")}
            position="bottom"
            width="auto"
            maxWidth="100px"
            bg="bg-white"
          >
            <button
              onClick={onRedo}
              disabled={redoStack.length === 0}
              aria-label="Redo"
              className={`flex items-center justify-center gap-1 rounded-md p-2 ${
                redoStack.length === 0
                  ? "opacity-40"
                  : "hover:bg-gray-200 cursor-pointer"
              }`}
            >
              <FiRotateCw size={20} />
            </button>
          </Tooltip>
          <Tooltip
            message={() => tooltipContent("save")}
            position="bottom"
            width="auto"
            maxWidth="100px"
            bg="bg-white"
          >
            <button
              onClick={onSave}
              className={`px-3 py-1 text-sm font-semibold rounded-md ${
                undoStack.length === 0
                  ? "bg-gray-200 text-gray-600"
                  : "bg-black text-white hover:bg-gray-800 cursor-pointer"
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
