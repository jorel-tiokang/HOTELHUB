import React from "react";
import "./globals.css"; // Keep your global CSS import here

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}