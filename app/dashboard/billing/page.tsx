const fakeInvoices = [
  { id: "INV-001", date: "2024-05-01", amount: "$49.99", status: "Paid" },
  { id: "INV-002", date: "2024-04-01", amount: "$49.99", status: "Paid" },
  { id: "INV-003", date: "2024-03-01", amount: "$49.99", status: "Unpaid" },
];

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Billing</h1>
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="mb-2 text-gray-700 font-medium">
          Current Plan: <span className="font-bold text-green-700">Pro</span>
        </div>
        <div className="mb-2 text-gray-700 font-medium">
          Payment Method: <span className="font-bold">Visa **** 4242</span>
        </div>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Update Payment Method
        </button>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Invoices</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {fakeInvoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">
                  {inv.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {inv.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {inv.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
