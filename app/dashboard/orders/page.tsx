const fakeOrders = [
  { id: "1234", date: "2024-06-01", status: "Delivered", total: "$199.99" },
  { id: "1235", date: "2024-05-28", status: "Shipped", total: "$89.50" },
  { id: "1236", date: "2024-05-20", status: "Processing", total: "$49.00" },
  { id: "1237", date: "2024-05-15", status: "Cancelled", total: "$120.00" },
];

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Orders</h1>
      <div className="bg-white p-6 rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {fakeOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {order.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
