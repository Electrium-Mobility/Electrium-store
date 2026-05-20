"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
