"use server";

import { createClient } from "@/utils/supabase/server";
import { SignUpSchema } from "../lib/definitions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { encodedRedirect } from "@/utils/encodedRedirect";

export async function signup(formData: FormData) {
  const validatedFields = SignUpSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect("/error");
  }

  revalidatePath("/", "layout");
  return redirect(
    `/email-verification?email=${encodeURIComponent(data.email)}`
  );
}

export async function checkUserExists(email: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error checking users:", error);
    return false;
  }

  const userExists = data.users.some((user) => user.email === email);
  console.log(`User ${email} exists:`, userExists);
  return userExists;
}

export async function login(formData: FormData): Promise<boolean> {
  // Check if environment variables are loaded
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.error("Missing Supabase environment variables");
    console.error("URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.error(
      "ANON_KEY exists:",
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return false;
  }

  // Debug: Show which Supabase project we're connecting to
  console.log(
    "Connecting to Supabase URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  console.log(
    "Using anon key starting with:",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + "..."
  );

  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("Login attempt for:", data.email);
  console.log("Email length:", data.email.length);
  console.log("Password length:", data.password.length);
  console.log("Email contains @:", data.email.includes("@"));

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error.message);
    console.error("Error code:", error.status);
    console.error("Full error object:", error);

    // Provide more specific error messages
    if (error.message === "Invalid login credentials") {
      console.error("Possible causes:");
      console.error("1. User account doesn't exist");
      console.error("2. Password is incorrect");
      console.error(
        "3. Email is not verified (if email verification is enabled)"
      );
      console.error("4. Wrong Supabase project (check URL above)");
    }

    return false; // Display "invalid email or password" message in the UI
  }

  console.log("Login successful for:", data.email);
  revalidatePath("/", "layout");
  return true; // Return true to indicate successful login
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", "/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/reset-password",
      "Password update failed (Code: " + error.code?.toString() + ")"
    );
  }

  encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
