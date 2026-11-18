"use client"
import { useEffect,useState } from "react";
import { createClient } from "@/utils/supabase/client";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Please log in to view your notifications.");
          return;
        }
        const { data, error: NotificationsError } = await supabase
          .from("notifications")
          .select("notification_id, message, created_at, is_read")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false});

        if(NotificationsError) {
          setError(`Error loading notifications: ${NotificationsError.message}`);
          return;
        }

        setNotifications(data || []);
      } catch (e) {
        setError("Unexpected error while loading notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if(loading) {
    return <div className="p-8">Loading notifications../</div>;
  }

  if(error) {
    return <div className="p-8 text-status-error-text">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        Notifications
      </h1>
      <div className="bg-background p-6 rounded shadow divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.notifucation_id}
              className={`py-4 flex items-center justify-between ${
                !n.is_read ? "font-semibold" : ""
              }`}
            >
              <div className="text-text-primary">{n.message}</div>
              <div className="text-xs text-text-muted">
                {new Date(n.create_at).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-text-muted">
            No notifications yet.
          </div>
        )}
      </div>
    </div>
  );
}
