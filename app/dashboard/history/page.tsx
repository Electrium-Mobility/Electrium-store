const fakeHistory = [
  { id: "1201", date: "2024-04-10", status: "Delivered", total: "$89.99" },
  { id: "1202", date: "2024-03-22", status: "Delivered", total: "$59.00" },
  { id: "1203", date: "2024-02-15", status: "Returned", total: "$120.00" },
];

export default function OrderHistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Order History
      </h1>
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
            {fakeHistory.map((order) => (
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
                        : "bg-yellow-100 text-yellow-700"
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
