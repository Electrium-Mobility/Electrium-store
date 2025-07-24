"use client";
import { useState, useEffect } from "react";
import { Moon, Sun, LogOut, Settings, Bell, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
];

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Check for dark mode preference in localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        setDarkMode(true);
        window.document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        window.document.documentElement.classList.remove("dark");
      }
    }
    // Check for language preference
    const lang = localStorage.getItem("language");
    if (lang) setLanguage(lang);
    // Check for notifications preference
    const notif = localStorage.getItem("notifications");
    if (notif === "off") setNotifications(false);
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        const root = window.document.documentElement;
        if (next) {
          root.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          root.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }
      return next;
    });
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  };

  const handleNotificationsToggle = () => {
    setNotifications((prev) => {
      const next = !prev;
      localStorage.setItem("notifications", next ? "on" : "off");
      return next;
    });
  };

  return (
    <div className="space-y-6 bg-white min-h-screen pb-10">
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-base text-gray-600">
              Manage your dashboard preferences
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-2xl mx-auto grid grid-cols-1 gap-6">
        {/* Dark Mode Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {darkMode ? (
              <Moon className="h-5 w-5 text-gray-700" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-base font-semibold text-gray-900">
              Dark Mode
            </span>
          </div>
          <button
            onClick={handleDarkModeToggle}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? "bg-emerald-600" : "bg-gray-200"}`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-0"}`}
            ></span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span className="text-base font-semibold text-gray-900">
              Language
            </span>
          </div>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-emerald-600" />
            <span className="text-base font-semibold text-gray-900">
              Notifications
            </span>
          </div>
          <button
            onClick={handleNotificationsToggle}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${notifications ? "bg-emerald-600" : "bg-gray-200"}`}
            aria-label="Toggle notifications"
          >
            <span
              className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${notifications ? "translate-x-5" : "translate-x-0"}`}
            ></span>
          </button>
        </div>

        {/* Log Out */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LogOut className="h-5 w-5 text-red-600" />
            <span className="text-base font-semibold text-gray-900">
              Log Out
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
