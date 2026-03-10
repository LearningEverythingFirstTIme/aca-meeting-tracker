"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

// The app always uses the warm light (woodland path) theme.
// Dark mode has been removed to ensure a consistently warm, welcoming experience.
interface ThemeContextValue {
  theme: "light";
  resolvedTheme: "light";
  setTheme: (theme: "light") => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Clear any previously stored dark theme on mount
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: "light",
        resolvedTheme: "light",
        setTheme: () => {},
        toggleTheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  return useContext(ThemeContext);
};
