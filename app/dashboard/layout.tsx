import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Bell,
  History,
  User,
  ShoppingCart,
  Heart,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Order History", href: "/dashboard/history", icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
        </div>
        <nav className="flex-1 mt-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
