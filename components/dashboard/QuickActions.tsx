import { useRouter } from "next/navigation";
// ... existing code ...
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
