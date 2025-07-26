const ordersData = [
  { id: 1, customer: "John Doe", total: 59.98, status: "Shipped" },
  { id: 2, customer: "Jane Smith", total: 89.97, status: "Processing" },
  { id: 3, customer: "Bob Johnson", total: 39.99, status: "Delivered" },
]

export default function Orders() {
  return (
    <div id="orders">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Recent Orders</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Customer</th>
            <th className="py-2 px-4 border-b">Total</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {ordersData.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.id}</td>
              <td className="py-2 px-4 border-b">{order.customer}</td>
              <td className="py-2 px-4 border-b">${order.total.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

