const fakeWishlist = [
  {
    id: 1,
    name: "Electric Bike",
    price: "$999.00",
    image: "/img/bike-display.png",
  },
  {
    id: 2,
    name: "Electric Skateboard",
    price: "$499.00",
    image: "/img/skateboard-display.png",
  },
  {
    id: 3,
    name: "OneWheel",
    price: "$1,299.00",
    image: "/img/one-wheel-display.png",
  },
];

export default function WishlistPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {fakeWishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-contain mb-4"
            />
            <div className="text-lg font-semibold text-gray-800">
              {item.name}
            </div>
            <div className="text-green-600 font-bold mt-2">{item.price}</div>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
