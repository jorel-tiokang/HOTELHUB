"use client";

import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, defaultTheme = "dark" }: ThemeProviderProps) {
  useEffect(() => {
    // Respect saved preference, then defaultTheme, then system preference
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : defaultTheme === "dark" || prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
  }, [defaultTheme]);

  return <>{children}</>;
}