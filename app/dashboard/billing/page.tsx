const fakeInvoices = [
  { id: "INV-001", date: "2024-05-01", amount: "$49.99", status: "Paid" },
  { id: "INV-002", date: "2024-04-01", amount: "$49.99", status: "Paid" },
  { id: "INV-003", date: "2024-03-01", amount: "$49.99", status: "Unpaid" },
];

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Billing</h1>
      <div className="bg-background p-6 rounded shadow mb-6">
        <div className="mb-2 text-text-secondary font-medium">
          Current Plan: <span className="font-bold text-green-700">Pro</span>
        </div>
        <div className="mb-2 text-text-secondary font-medium">
          Payment Method: <span className="font-bold">Visa **** 4242</span>
        </div>
        <button className="mt-2 px-4 py-2 bg-btn-primary text-text-inverse rounded hover:bg-btn-primary-hover transition">
          Update Payment Method
        </button>
      </div>
      <div className="bg-background p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Invoices</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Invoice #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-gray-100">
            {fakeInvoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-text-primary">
                  {inv.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                  {inv.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                  {inv.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "Paid"
                        ? "bg-status-success-bg text-green-700"
                        : "bg-status-error-bg text-red-700"
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
