/***************************************************************************************************
 * Name of code artifact: Shop.tsx
 * Brief description of what the code does:
 *   The Shop component fetches a list of products from an API endpoint using React Query and 
 *   displays them in a responsive grid. It supports filtering by category and search query, and 
 *   allows the user to select a product for viewing detailed information. The component also 
 *   includes a button to navigate to an external Amazon page for the product.
 * Programmer’s name: Darshil Patel
 * Date the code was created: 11/7/24
 * Dates the code was revised: 11/29/24
 * Brief description of each revision & author:
 *   11/29/24 - Brady Holland: Integrated search and category filtering logic, and added product
 *   selection callback handling.
 * Preconditions:
 *   - Must run in a React environment.
 *   - Backend endpoint (`http://localhost:3000/api/items`) must be accessible and return a list of 
 *     products in JSON format.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - `selectedCategory`: string indicating which category should be filtered; "All" means no 
 *     category filter.
 *   - `searchQuery`: string used to filter products by name.
 *   - `addToCart`: function to handle adding a product to the cart by ID.
 *   - `removeFromCart`: function to remove product from cart by ID.
 *   - `setSelectedProduct`: function to set the currently selected product for detail view.
 * Unacceptable inputs:
 *   - Non-string for `selectedCategory` or `searchQuery`.
 *   - Non-function values for `addToCart`, `removeFromCart`, or `setSelectedProduct` would break the intended functionality.
 * Postconditions:
 *   - Renders a grid of filtered products, or a "No products found" message if none match the criteria.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If the fetch fails, displays an error message.
 *   - If loading, displays a loading message.
 * Side effects:
 *   - Fetches products from the provided API endpoint.
 * Invariants:
 *   - The product display layout remains a responsive grid.
 * Any known faults:
 *   - If the API endpoint changes or the data schema is altered, the component may not function as intended.
 * Comments summarizing major blocks of code:
 *   - useQuery hook: Fetches product data.
 *   - Filtering logic: Filters products by category and search query.
 *   - Conditional rendering: Shows loading, error, products grid, or no-results message depending on state.
 * Comments on every line are provided below.
 ***************************************************************************************************/


import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

interface ShopProps {
  selectedCategory: string;
  searchQuery: string;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  setSelectedProduct: (product: Product) => void;
}

interface Product {
  name: string;
  price: string;
  URL: string;
  quantity: string;
  category: string;
  id: number;
  img: string;
}

export const Shop: React.FC<ShopProps> = ({ selectedCategory, searchQuery, addToCart, removeFromCart, setSelectedProduct}) => {
  // Fetch products with TanStack Query
  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products. Please try again later.</p>;
  }

  // Filtered products based on search query and category
  const filteredProducts = products.filter(
    (product) =>
      (product.name && (selectedCategory === 'All' || product.category === selectedCategory)) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <section className="w-full lg:w-2/3" id="order-products">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-gray-800 rep-6 rounded-lg shadow-md transition duration-300 flex flex-col cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative flex justify-center items-center">
                <span className="absolute top-2 left-2 bg-teal-500 text-gray-900 text-sm px-2 py-1 rounded-md z-10">
                    {product.price}
                  </span>
                  <img
                    src={product.img}
                    alt={product.name}
                    className="y-full h-48 object-cover rounded-md mb-4"
                  />
                </div>
                <h2 className="text-xl font-bold text-teal-400 mb-2">
                  {product.name}
                </h2>
                <div className='y-full flex items-baseline justify-center'>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                  }}
                  className=" bg-teal-500 text-gray-900 px-4 py-2 my-4 rounded-full hover:bg-teal-400 transition duration-200 flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" /> Amazon.com
                </button>
                </div>
                
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No products found matching "{searchQuery}".
          </p>
        )}
      </section>
    </>
)
};
