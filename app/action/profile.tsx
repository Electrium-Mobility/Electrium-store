"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Extract form data
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  // Update profile in profiles table
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    address: address,
  });

  if (profileError) {
    console.error("Error updating profile:", profileError);
    return { error: "Failed to update profile" };
  }

  // Update email in auth.users if it changed
  if (email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({
      email: email,
    });

    if (emailError) {
      console.error("Error updating email:", emailError);
      return { error: "Failed to update email" };
    }
  }

  revalidatePath("/dashboard/profile");
  return { success: "Profile updated successfully" };
}

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get profile data
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    avatar_url: profile?.avatar_url || "",
  };
}
