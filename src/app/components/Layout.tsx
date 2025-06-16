"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const hideHeaderFooter = ["/login", "/register", "/editor", "/web-editor"];
  const isHeadreFooter = hideHeaderFooter.includes(pathName);

  return (
    <>
      {!isHeadreFooter && <Header />}
      {children}
      {!isHeadreFooter && <Footer />}
    </>
  );
}
