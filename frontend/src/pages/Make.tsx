import React, { useState, ChangeEvent } from 'react';

interface Ingredient {
    name: string;
    quantity: string;
    unit: string;
}

interface Recipe {
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string;
    image: File | null;
}

/**
 * Make Page
 * Allows users to create and save recipes.
 * @returns {React.JSX.Element} - Making Page with recipe form in a modal.
 */
const Make: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState<Recipe>({
        title: '',
        description: '',
        ingredients: [],
        instructions: '',
        image: null,
    });

    const [newIngredient, setNewIngredient] = useState<Ingredient>({
        name: '',
        quantity: '',
        unit: '',
    });

    // Handle input changes for text fields
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle ingredient addition
    const handleAddIngredient = () => {
        if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
            setFormData({
                ...formData,
                ingredients: [...formData.ingredients, newIngredient],
            });
            setNewIngredient({ name: '', quantity: '', unit: '' });
        }
    };

    // Handle ingredient input
    const handleIngredientChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewIngredient({ ...newIngredient, [name]: value });
    };

    // Handle image upload
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    // Save recipe and close modal
    const handleSaveRecipe = () => {
        setRecipes([...recipes, formData]);
        setFormData({
            title: '',
            description: '',
            ingredients: [],
            instructions: '',
            image: null,
        });
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10">
            <h1 className="text-5xl font-bold text-center py-5 text-green-600">Create and Share Your Recipe!</h1>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 transition duration-200"
            >
                Create Recipe
            </button>

            {/* Modal for Recipe Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-lg relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">New Recipe</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Recipe Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter recipe title"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your recipe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    rows={3}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Ingredients</label>
                                <div className="flex items-center space-x-2 mb-3">
                                    <input
                                        type="text"
                                        name="name"
                                        value={newIngredient.name}
                                        onChange={handleIngredientChange}
                                        placeholder="Ingredient"
                                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        name="quantity"
                                        value={newIngredient.quantity}
                                        onChange={handleIngredientChange}
                                        placeholder="Quantity"
                                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        name="unit"
                                        value={newIngredient.unit}
                                        onChange={handleIngredientChange}
                                        placeholder="Unit"
                                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddIngredient}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                <ul className="list-disc list-inside text-gray-700">
                                    {formData.ingredients.map((ingredient, index) => (
                                        <li key={index}>
                                            {ingredient.quantity} {ingredient.unit} of {ingredient.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Instructions</label>
                                <textarea
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleInputChange}
                                    placeholder="Enter step-by-step instructions"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                    rows={5}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-lg font-medium text-gray-700 mb-2">Recipe Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-gray-600 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSaveRecipe}
                                className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-200"
                            >
                                Save Recipe
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Displaying Saved Recipes */}
            <div className="mt-10 w-full max-w-3xl space-y-6">
                {recipes.map((recipe, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
                        <p className="text-gray-600 mb-4">{recipe.description}</p>
                        <ul className="list-disc list-inside mb-4 text-gray-700">
                            {recipe.ingredients.map((ingredient, idx) => (
                                <li key={idx}>
                                    {ingredient.quantity} {ingredient.unit} of {ingredient.name}
                                </li>
                            ))}
                        </ul>
                        <p className="text-gray-700">{recipe.instructions}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Make;
