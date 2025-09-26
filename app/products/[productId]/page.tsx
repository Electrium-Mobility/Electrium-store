import React from "react";
import Image from "next/image";
import Navbar from "@/components/shop/Navbar";
import Footer from "@/components/shop/Footer";
import { Bike, getOneBike } from "@/utils/getBike";
import { notFound } from "next/navigation";
import CartAdd from "./cartAdd";
import { GetServerSideProps } from "next";

function CartNotification({
  bike,
  subtotal,
  quantity,
  numItems,
}: {
  bike: Bike;
  subtotal: number;
  quantity: number;
  numItems: number;
}) {
  return (
    <div className="w-80 absolute mt-24 right-6 rounded-3xl bg-[hsl(var(--surface))] space-y-7 flex-col align-center p-6 drop-shadow-lg">
      <h1 className="text-base font-bold text-[hsl(var(--text-primary))]">
        Your Shopping Cart
      </h1>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-self-start text-sm text-[hsl(var(--text-primary))]">
          Subtotal: &nbsp;<div className="font-semibold"> CA${subtotal}</div>
        </div>
        <div className="flex flex-row justify-self-end text-sm text-[hsl(var(--text-primary))]">
          <div className="font-semibold">{numItems}</div>&nbsp;item
        </div>
      </div>
      <div className="flex flex-row space-x-4">
        <img
          src={String(bike.image)}
          className="w-1/3 border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] rounded-xl"
        />
        <div className="flex-col">
          <div className="text-sm text-[hsl(var(--text-primary))]">
            {bike.name}
          </div>
          <div className="text-sm text-[hsl(var(--text-primary))]">
            CA${bike.sell_price}
          </div>
          <div className="text-sm text-[hsl(var(--text-muted))]">
            Quantity: {quantity}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <button className="w-100 h-100 text-center bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] p-3 text-m rounded-2xl hover:bg-[hsl(var(--btn-primary-hover))]">
          View and Edit Cart
        </button>
        <button className="w-100 h-100 text-center bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] p-3 text-m rounded-2xl hover:bg-[hsl(var(--btn-primary-hover))]">
          Secure Checkout
        </button>
      </div>
    </div>
  );
}

interface ProductPageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ rental?: string }>;
}

// Mock reviews data - in a real app, this would come from a database
const mockReviews = [
  {
    id: 1,
    name: "Ruby",
    rating: 5,
    comment: "The Volter Electric Bike is beautiful. Excellent review... Excellent review..."
  },
  {
    id: 2,
    name: "Bob",
    rating: 5,
    comment: "The Volter Electric Bike is beautiful. Excellent review... Excellent review..."
  },
  {
    id: 3,
    name: "Jack",
    rating: 4,
    comment: "The Volter Electric Bike is beautiful. Excellent review... Excellent review..."
  },
  {
    id: 4,
    name: "Neal",
    rating: 5,
    comment: "The Volter Electric Bike is beautiful. Excellent review... Excellent review..."
  }
];

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Review card component
function ReviewCard({ review }: { review: typeof mockReviews[0] }) {
  const colors = [
    "bg-purple-100 border-purple-200",
    "bg-pink-100 border-pink-200", 
    "bg-green-100 border-green-200",
    "bg-orange-100 border-orange-200"
  ];
  
  return (
    <div className={`p-6 rounded-2xl border-2 ${colors[review.id - 1]} space-y-4`}>
      <StarRating rating={review.rating} />
      <p className="text-sm text-gray-700 leading-relaxed">
        {review.comment}
      </p>
      <p className="font-semibold text-gray-900">{review.name}</p>
    </div>
  );
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { productId } = await params;
  const { rental } = await searchParams;
  const isRentalMode = rental === "true";

  const bike = await getOneBike(productId);
  if (!bike) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Product Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Image */}
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-2xl p-8 w-full max-w-md">
                  <Image
                    src={bike.image || "/img/placeholder.png"}
                    alt={bike.name}
                    unoptimized
                    width={400}
                    height={400}
                    style={{ objectFit: "contain" }}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {bike.name}
                  </h1>
                  <p className="text-3xl font-bold text-green-600">
                    {isRentalMode
                      ? `CA $${bike.rental_rate?.toFixed(2) || "0.00"} per hour`
                      : `CA $${bike.sell_price?.toFixed(2) || "0.00"}`}
                  </p>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {bike.description || "Introducing Volter: Where Innovation Meets Adventure. At the intersection of innovation and adventure, the Volter electric bicycle emerges as a true embodiment of cutting-edge design and beautiful bike description..."}
                  </p>
                </div>

                {/* Add to Cart Section */}
                <div className="space-y-4">
                  <CartAdd bike={isRentalMode ? { ...bike, for_rent: true } : bike} />
                </div>

                {/* Shipping Information */}
                <div className="border-t pt-6 space-y-2">
                  <h3 className="font-semibold text-gray-900">Shipping Information...</h3>
                  <p className="text-sm text-gray-600">Shipping Information...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Overview Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Overview</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  With a top speed of 42 km/h, Volter offers a thrilling ride that combines eco-friendly mobility with an exhilarating experience. Powered by a battery supporting a maximum range of 42 km, this electric bike is not just a mode of transportation but a statement of innovation and style.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Covering distances between 15 to 25 kilometers on a single charge, Volter ensures that every journey is not only efficient but also filled with possibilities. Whether you're commuting through urban landscapes or embarking on scenic routes, Volter empowers you to explore with confidence, knowing that its robust design and advanced components are ready for any terrain.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>
                  Beautiful bike overview...
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
