"use client";
import { useState, useEffect } from "react";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateProfileData } from "@/app/action/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const supabase = createClient();
      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) return;
      setUser(currentUser);
      // Fetch user profile from customers table
      const { data: userProfile } = await supabase
        .from("customers")
        .select("*")
        .eq("id", currentUser.id)
        .single();
      setProfile(userProfile);
      if (userProfile) {
        setFormData({
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          phone: userProfile.phone || "",
          address: userProfile.address || "",
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Calculate profile completion
  const profileFields = [
    { key: "first_name", label: "First Name", icon: User },
    { key: "last_name", label: "Last Name", icon: User },
    { key: "phone", label: "Phone", icon: Phone },
    { key: "address", label: "Address", icon: MapPin },
  ];

  const completedFields = profileFields.filter(
    (field) =>
      formData[field.key as keyof typeof formData] &&
      formData[field.key as keyof typeof formData].trim() !== ""
  ).length;
  const profileCompletion = (completedFields / profileFields.length) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const result = await updateProfileData(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setProfile((prev: any) => ({ ...prev, ...formData }));
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name} ${formData.last_name}`;
    } else if (formData.first_name) {
      return formData.first_name;
    } else if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600">
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>
              </div>

              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      Verified
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-3" />
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      rows={3}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="font-bold text-lg mb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <span>Profile Completion</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{profileCompletion.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                {profileFields.map((field) => {
                  const Icon = field.icon;
                  const isCompleted =
                    formData[field.key as keyof typeof formData] &&
                    formData[field.key as keyof typeof formData].trim() !== "";
                  return (
                    <div
                      key={field.key}
                      className="flex items-center space-x-2"
                    >
                      <Icon
                        className={`h-4 w-4 ${isCompleted ? "text-emerald-500" : "text-gray-400"}`}
                      />
                      <span
                        className={`text-sm ${isCompleted ? "text-gray-700" : "text-gray-500"}`}
                      >
                        {field.label}
                      </span>
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="font-bold text-lg mb-4 flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>Account Information</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 font-semibold">
                    Display Name
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">
                    Email
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold">
                    Member Since
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
