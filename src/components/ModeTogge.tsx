"use client";

import * as React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until the component is mounted on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Empty layout placeholder to prevent layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 shadow-sm flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <FiMoon className="h-5 w-5 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}