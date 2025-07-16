import { useRouter } from "next/navigation";
import { ListOrdered, User, Heart, CreditCard } from "lucide-react";

const quickActions = [
  {
    id: "orders",
    label: "View Orders",
    href: "/dashboard/orders",
    icon: ListOrdered,
    bgColor: "bg-blue-100",
    hoverColor: "hover:bg-blue-200",
    iconColor: "text-blue-600",
  },
  {
    id: "profile",
    label: "Edit Profile",
    href: "/dashboard/profile",
    icon: User,
    bgColor: "bg-green-100",
    hoverColor: "hover:bg-green-200",
    iconColor: "text-green-600",
  },
  {
    id: "wishlist",
    label: "View Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
    bgColor: "bg-pink-100",
    hoverColor: "hover:bg-pink-200",
    iconColor: "text-pink-600",
  },
  {
    id: "billing",
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    bgColor: "bg-yellow-100",
    hoverColor: "hover:bg-yellow-200",
    iconColor: "text-yellow-600",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => router.push(action.href)}
              className={`flex flex-col items-center p-4 ${action.bgColor} rounded-xl ${action.hoverColor} transition-colors duration-200`}
            >
              <Icon className={`h-6 w-6 ${action.iconColor} mb-2`} />
              <span className="text-sm font-medium text-gray-700 text-center">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
