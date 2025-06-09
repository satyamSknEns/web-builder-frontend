"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiUser } from "react-icons/fi";
import Image from "next/image";

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [animateIn, setAnimateIn] = useState<boolean>(false);

  const isLoggedIn: boolean = true;
  const userName: string = "Satyam";

  useEffect(() => {
    if (isSearchOpen) {
      setAnimateIn(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => setIsSearchOpen(false), 300);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const headerElement = document.getElementById("headerContainer");

    const handleScroll = () => {
      if (headerElement) {
        const headerHeight = headerElement.offsetHeight;
        const scrollY = window.scrollY;

        if (scrollY > headerHeight) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        id="headerContainer"
        className={`flex sticky items-center justify-between px-6 py-4 bg-white z-40 ${
          scrolled ? "transition-all ease-in-out top-0 shadow-md left-0 right-0" : "relative"
        }`}
      >
        <div className="text-2xl font-bold text-blue-600">
          <Link href="/logo.png">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" width={100} height={50} alt="logo" />
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-red-600">
            Home
          </Link>
          <Link href="/catalog" className="hover:text-red-600">
            Catalog
          </Link>
          <Link href="/blogs" className="hover:text-red-600">
            Blogs
          </Link>
          <Link href="/about" className="hover:text-red-600">
            About
          </Link>
          <Link href="/web-editor" className="hover:text-red-600">
            Web Editor
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-xl text-gray-700 hover:text-red-600 cursor-pointer"
            aria-label="Search"
          >
            <FiSearch />
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-700 cursor-pointer">
            <FiUser />
            {isLoggedIn && <span className="font-medium mt-0.5">{userName}</span>}
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white absolute top-20 w-[90%] max-w-[50%] p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
              animateIn
                ? "translate-y-0 opacity-100"
                : "-translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-black">Search</h2>
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-red-500 cursor-pointer"
                aria-label="Close Search"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              placeholder="Type your query..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-500 text-slate-600"
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
