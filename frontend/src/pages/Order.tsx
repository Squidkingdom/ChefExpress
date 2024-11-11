import React, { useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

/**
 * Order Page
 * The Ordering page for ChefExpress where users can browse products
 * @returns {React.JSX.Element} - Order Page with product list and cart summary
 */
const Order: React.FC = () => {
    // Sample product data (in a real app, this could be fetched from an API)
    const [products] = useState<Product[]>([
        { id: 1, name: 'Chef Knife', description: 'High-quality chef knife', price: 29.99, image: '/images/knife.jpg' },
        { id: 2, name: 'Mixing Bowl Set', description: 'Durable stainless steel bowls', price: 19.99, image: '/images/bowls.jpg' },
        { id: 3, name: 'Cutting Board', description: 'Bamboo cutting board', price: 15.99, image: '/images/board.jpg' },
    ]);

    const [cart, setCart] = useState<Product[]>([]);

    // Add a product to the cart
    const addToCart = (product: Product) => {
        setCart([...cart, product]);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
            <h1 className="text-5xl font-bold text-center py-5 text-green-600">Order Your Favorite Kitchen Tools!</h1>
            <p className="text-lg text-center mb-8 text-gray-700">
                Browse our selection of essential kitchen items.
            </p>

            {/* Product List */}
            <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white p-6 rounded-lg shadow-md text-center transition duration-300 hover:shadow-lg">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <p className="text-xl font-semibold text-green-500 mb-4">${product.price.toFixed(2)}</p>
                        <button
                            onClick={() => addToCart(product)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </section>

            {/* Cart Summary */}
            <section className="w-full max-w-2xl mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-4">Your Cart</h2>
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                ) : (
                    <div>
                        {cart.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                                <p className="text-lg font-medium text-gray-800">{item.name}</p>
                                <p className="text-lg font-semibold text-green-500">${item.price.toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="flex justify-between items-center py-4 mt-4 border-t border-gray-200">
                            <p className="text-xl font-semibold">Total</p>
                            <p className="text-xl font-semibold text-green-500">
                                ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Order;
