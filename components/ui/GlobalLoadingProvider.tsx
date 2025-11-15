"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
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

  // Note: Avoid overriding window.history to prevent interfering with Next's router.
  // Consumers can still toggle global loading via context if needed.

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
