"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileData(profileData: {
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error getting user:", userError);
      return { success: false, error: "Authentication error" };
    }
    if (!user) {
      console.error("No user found");
      return { success: false, error: "User not authenticated" };
    }
    // Upsert all fields, including address and phone
    const upsertData: any = {
      id: user.id,
      first_name: profileData.first_name || null,
      last_name: profileData.last_name || null,
      email: user.email,
      address: profileData.address || null,
      phone: profileData.phone || null,
    };
    const { data, error: customerError } = await supabase
      .from("customers")
      .upsert(upsertData)
      .select();
    if (customerError) {
      console.error("Error updating customer:", customerError);
      return {
        success: false,
        error: `Failed to update profile: ${customerError.message || "Unknown error"}`,
      };
    }
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Unexpected error in updateProfileData:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  // Get customer profile data
  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error("Error fetching customer profile:", error);
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    avatar_url: customer?.avatar_url || "",
  };
}

export async function testDatabaseConnection() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error("Auth error:", userError);
      return { success: false, error: "Authentication failed" };
    }
    if (!user) {
      return { success: false, error: "No user found" };
    }
    // Test customers table access
    const { data: testData, error: testError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", user.id)
      .limit(1);
    if (testError) {
      console.error("Customers table access error:", testError);
      return {
        success: false,
        error: `Customers table error: ${testError.message}`,
      };
    }
    return { success: true, message: "Database connection OK" };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return { success: false, error: "Database connection failed" };
  }
}
