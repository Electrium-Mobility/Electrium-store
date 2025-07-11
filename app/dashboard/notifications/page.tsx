const fakeNotifications = [
  { id: 1, message: "Your order #1234 has shipped!", date: "2024-06-01" },
  {
    id: 2,
    message: "New product: Electric Scooter now available!",
    date: "2024-05-30",
  },
  { id: 3, message: "Your subscription was renewed.", date: "2024-05-28" },
];

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Notifications
      </h1>
      <div className="bg-white p-6 rounded shadow divide-y divide-gray-100">
        {fakeNotifications.map((n) => (
          <div key={n.id} className="py-4 flex items-center justify-between">
            <div className="text-gray-800">{n.message}</div>
            <div className="text-xs text-gray-500">{n.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
