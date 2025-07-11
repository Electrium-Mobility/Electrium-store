import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  ShoppingCart,
  Heart,
  Bell,
  DollarSign,
  CheckCircle,
  Clock,
  UserCheck,
  Gift,
} from "lucide-react";

export default async function DashboardPage() {
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

  // Get user profile data
  let userName = "User";
  if (session?.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", session.user.id)
      .single();

    if (profile?.first_name && profile?.last_name) {
      userName = `${profile.first_name} ${profile.last_name}`;
    } else if (
      session.user.user_metadata?.first_name &&
      session.user.user_metadata?.last_name
    ) {
      userName = `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`;
    } else {
      userName = session.user.email || "User";
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-gray-900">
        Welcome back, {userName}
      </h1>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center bg-white rounded-lg shadow p-4">
          <div className="p-2 bg-gray-100 rounded-full mr-4">
            <ShoppingCart className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Orders</div>
            <div className="text-xl font-bold text-gray-900">3</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow p-4">
          <div className="p-2 bg-red-100 rounded-full mr-4">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Wishlist</div>
            <div className="text-xl font-bold text-gray-900">5</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow p-4">
          <div className="p-2 bg-gray-100 rounded-full mr-4">
            <Bell className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Notifications</div>
            <div className="text-xl font-bold text-gray-900">$219.56</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow p-4">
          <div className="p-2 bg-gray-100 rounded-full mr-4">
            <DollarSign className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Money Spent</div>
            <div className="text-xl font-bold text-gray-900">$219.56</div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Chart & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="font-semibold text-lg mb-2">Orders</div>
            {/* Chart Placeholder */}
            <svg viewBox="0 0 300 100" className="w-full h-32">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                points="0,80 40,70 80,80 120,60 160,65 200,40 240,60 280,50"
              />
              <g fontSize="10" fill="#888">
                <text x="0" y="95">
                  Sun
                </text>
                <text x="40" y="95">
                  Mon
                </text>
                <text x="80" y="95">
                  Tue
                </text>
                <text x="120" y="95">
                  Wed
                </text>
                <text x="160" y="95">
                  Thu
                </text>
                <text x="200" y="95">
                  Fri
                </text>
                <text x="240" y="95">
                  Sat
                </text>
              </g>
            </svg>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="font-semibold text-lg mb-4">Recent Activity</div>
            <ul className="divide-y divide-gray-100">
              <li className="flex items-center py-3">
                <Heart className="h-5 w-5 text-gray-400 mr-3" />
                <span className="flex-1 text-gray-700">
                  You added "Item Name" to your wishlist
                </span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </li>
              <li className="flex items-center py-3">
                <CheckCircle className="h-5 w-5 text-gray-400 mr-3" />
                <span className="flex-1 text-gray-700">
                  Order #1235 was delivered
                </span>
                <span className="text-xs text-gray-500">6 hours ago</span>
              </li>
              <li className="flex items-center py-3">
                <Gift className="h-5 w-5 text-gray-400 mr-3" />
                <span className="flex-1 text-gray-700">
                  You subscribed to the Basic Plan
                </span>
                <span className="text-xs text-gray-500">Yesterday</span>
              </li>
              <li className="flex items-center py-3">
                <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
                <span className="flex-1 text-gray-700">
                  Order #1234 was placed
                </span>
                <span className="text-xs text-gray-500">2 days ago</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Side Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <ShoppingCart className="h-6 w-6 text-gray-400 mr-4" />
            <div>
              <div className="text-xs text-gray-500">Total Orders</div>
              <div className="text-lg font-bold text-gray-900">12</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <Clock className="h-6 w-6 text-gray-400 mr-4" />
            <div>
              <div className="text-xs text-gray-500">Avg. Delivery Time</div>
              <div className="text-lg font-bold text-gray-900">2.4-days</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <UserCheck className="h-6 w-6 text-gray-400 mr-4" />
            <div>
              <div className="text-xs text-gray-500">Active Subscriptions</div>
              <div className="text-lg font-bold text-gray-900">1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
