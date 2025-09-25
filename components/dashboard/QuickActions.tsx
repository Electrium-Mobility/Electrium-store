import { useRouter } from "next/navigation";
import { ListOrdered, User, Heart, CreditCard } from "lucide-react";

const quickActions = [
  {
    id: "orders",
    label: "View Orders",
    href: "/dashboard/orders",
    icon: ListOrdered,
    bgColor: "bg-status-info-bg",
    hoverColor: "hover:bg-blue-200",
    iconColor: "text-text-link",
  },
  {
    id: "profile",
    label: "Edit Profile",
    href: "/dashboard/profile",
    icon: User,
    bgColor: "bg-status-success-bg",
    hoverColor: "hover:bg-green-200",
    iconColor: "text-status-success-text",
  },
  {
    id: "wishlist",
    label: "View Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
    bgColor: "bg-status-error-bg",
    hoverColor: "hover:bg-status-error-bg-hover",
    iconColor: "text-status-error-text",
  },
  {
    id: "billing",
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    bgColor: "bg-status-warning-bg",
    hoverColor: "hover:bg-status-warning-bg-hover",
    iconColor: "text-status-warning-text",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-background rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-text-primary mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => router.push(action.href)}
              className={`flex flex-col items-center p-4 ${action.bgColor} rounded-xl ${action.hoverColor} transition-shadow`}
            >
              <Icon className={`h-6 w-6 ${action.iconColor} mb-2`} />
              <span className="text-sm font-medium text-text-secondary text-center">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
