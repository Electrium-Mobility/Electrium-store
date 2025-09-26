"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

interface GlobalLoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const GlobalLoadingContext = createContext<
  GlobalLoadingContextType | undefined
>(undefined);

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error(
      "useGlobalLoading must be used within a GlobalLoadingProvider"
    );
  }
  return context;
}

interface GlobalLoadingProviderProps {
  children: ReactNode;
}

export function GlobalLoadingProvider({
  children,
}: GlobalLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Track route changes for automatic loading states
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen for Next.js route changes
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function (...args) {
      handleStart();
      originalPush.apply(window.history, args);
      // Set a timeout to hide loading after navigation
      setTimeout(handleComplete, 500);
    };

    window.history.replaceState = function (...args) {
      handleStart();
      originalReplace.apply(window.history, args);
      setTimeout(handleComplete, 500);
    };

    // Handle browser back/forward buttons
    window.addEventListener("popstate", handleStart);

    // Cleanup
    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener("popstate", handleStart);
    };
  }, []);

  // Hide loading when pathname changes (route completed)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-3">
            <LoadingSpinner size="md" color="primary" />
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      )}
    </GlobalLoadingContext.Provider>
  );
}
