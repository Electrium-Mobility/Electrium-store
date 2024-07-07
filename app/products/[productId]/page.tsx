import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// This is a mock function. In a real app, you'd fetch this data from an API or database
function getProductData(productId: string) {
    const products = {
        "volter-electric-bike": {
            name: "Volter Electric Bike",
            price: "CA$9,999.00",
            description: "Introducing Volter: Where Innovation Meets Adventure. At the intersection of innovation and adventure, the Volter electric bicycle emerges as a true embodiment of cutting-edge design and engineering excellence.",
            image: "/img/bike-display.png",
            overview: [
                "With a top speed of 42 km/hr, Volter offers a thrilling ride that combines eco-friendly mobility with an exhilarating experience. Powered by a battery boasting a maximum voltage of 42 volts, this electric bicycle is not just a mode of transportation; it's a testament to the fusion of technology and style.",
                "Covering distances between 15 to 25 kilometers on a single charge, Volter ensures that every journey is not only efficient but also filled with possibilities. Whether you're commuting through urban landscapes or embarking on scenic routes, Volter empowers you to explore with confidence, knowing that its robust design and advanced components are ready for any terrain.",
                "Beautiful bike overview..."
            ]
        },
        // Add other products here...
    };

    return products[productId] || null;
}

export default function ProductPage({ params }: { params: { productId: string } }) {
    const product = getProductData(params.productId);

    if (!product) {
        return <div>Product not found</div>;
    }
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-100 py-16 px-4">
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                    <p className="text-xl text-gray-600 mb-6">{product.price}</p>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2">
                            <Image src={product.image} alt={product.name} width={500} height={500} className="rounded-lg" />
                        </div>
                        <div className="md:w-1/2">
                            <p className="text-gray-700 mb-4">{product.description}</p>
                            <div className="flex items-center gap-4 mb-6">
                                <input type="number" defaultValue={1} min={1} className="border p-2 w-16 text-center text-gray-800" />
                                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500">Add to Cart</button>
                            </div>
                            <hr className="my-6" />
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Information</h2>
                            <p className="text-gray-700">Shipping information...</p>
                        </div>
                    </div>

                    <hr className="my-8" />

                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Product Overview</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        {product.overview.map((item, index) => (
                            <li key={index} className="text-gray-700">{item}</li>
                        ))}
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
}