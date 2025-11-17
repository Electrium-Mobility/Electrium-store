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
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {fakeWishlist.map((item) => (
          <div
            key={item.id}
            className="bg-background rounded-lg shadow p-4 flex flex-col items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-contain mb-4"
            />
            <div className="text-lg font-semibold text-text-primary">
              {item.name}
            </div>
            <div className="text-status-success-text font-bold mt-2">{item.price}</div>
            <button className="mt-4 px-4 py-2 bg-btn-danger text-text-inverse rounded hover:bg-btn-danger transition">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
