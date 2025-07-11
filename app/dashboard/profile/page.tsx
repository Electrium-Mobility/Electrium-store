import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ProfileForm from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Get profile data
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const profileData = {
    id: session.user.id,
    email: session.user.email,
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    avatar_url: profile?.avatar_url || "",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <div className="mt-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ProfileForm profile={profileData} />
          </div>
        </div>
      </div>
    </div>
  );
}
