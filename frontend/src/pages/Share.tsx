import React, { useState, ChangeEvent } from 'react';

interface SharedItem {
    id: number;
    image: string;
    description: string;
}

/**
 * Share Page
 * Allows users to upload photos/videos and share them with others.
 * @returns {React.JSX.Element} - Sharing Page with upload section and gallery
 */
const Share: React.FC = () => {
    const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    // Handle file selection
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    // Handle adding shared item
    const handleShare = () => {
        if (selectedImage && description) {
            const newItem: SharedItem = {
                id: sharedItems.length + 1,
                image: URL.createObjectURL(selectedImage),
                description: description,
            };
            setSharedItems([newItem, ...sharedItems]);
            setSelectedImage(null);
            setDescription('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
            <h1 className="text-5xl font-bold text-center py-5 text-purple-600">Share Your Culinary Creations!</h1>
            <p className="text-lg text-center mb-8 text-gray-700">
                Upload photos of your recipes and share them with the community.
            </p>

            {/* Upload Section */}
            <section className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                <h2 className="text-3xl font-semibold text-center mb-6">Upload Your Creation</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-gray-600 px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                    rows={3}
                />
                <button
                    onClick={handleShare}
                    className="mt-4 w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition duration-200"
                >
                    Share
                </button>
            </section>

            {/* Gallery of Shared Items */}
            <section className="w-full max-w-4xl mt-10">
                <h2 className="text-3xl font-semibold text-center mb-6">Community Creations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sharedItems.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                            <img
                                src={item.image}
                                alt="Shared Creation"
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <p className="text-gray-700">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Share;
