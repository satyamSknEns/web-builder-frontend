import React from "react";
import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import Image from "next/image";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-700 px-6 py-4 mt-10 shadow-inner">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xl font-bold text-blue-600">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={100} height={50} />
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          &copy; {currentYear} 0Clik. All rights reserved.
        </div>

        <div className="flex gap-4 text-xl text-gray-600">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FiFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FiTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FiInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
