import { useState, useEffect } from "react";

const useSessionStorage = (name: string) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    // Initial value
    const val = sessionStorage.getItem(name);
    if (val) {
      setValue(val);
    }

    // Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === name) {
        setValue(e.newValue || "");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [name]);

  // Custom event for same-window updates
  useEffect(() => {
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === name) {
        setValue(e.detail.value || "");
      }
    };

    window.addEventListener(
      "sessionStorageChange",
      handleCustomStorageChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "sessionStorageChange",
        handleCustomStorageChange as EventListener
      );
  }, [name]);

  return value;
};

export default useSessionStorage;
