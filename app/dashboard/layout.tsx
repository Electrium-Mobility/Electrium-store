"use client";
import Link from "next/link";
import { LayoutDashboard, User, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userInitials, setUserInitials] = useState("EM");
  const [loading, setLoading] = useState(true);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  useEffect(() => {
    async function fetchUserProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("customers")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();
        if (profile?.first_name && profile?.last_name) {
          setUserInitials(
            `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
          );
        } else if (profile?.first_name) {
          setUserInitials(profile.first_name[0].toUpperCase());
        } else if (user.email) {
          setUserInitials(user.email[0].toUpperCase());
        }
      }
      setLoading(false);
    }
    fetchUserProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-emerald-50 via-white to-white shadow-xl flex flex-col rounded-r-3xl m-2">
        <div className="flex flex-col items-center p-8 border-b">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3 shadow-md">
            {/* User avatar placeholder */}
            <span className="text-2xl font-bold text-emerald-600">
              {userInitials}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">My Account</h1>
        </div>
        <nav className="flex-1 mt-8 space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm group
                  ${isActive ? "bg-emerald-100 text-emerald-700 shadow-md" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"}
                  hover:scale-[1.03]`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto mb-6 px-8 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Electrium Mobility
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
