/***************************************************************************************************
 * Name of code artifact: ProductGrid.tsx
 * Brief description of what the code does:
 *   This component fetches a list of products from a backend API and displays them in a responsive 
 *   grid layout. Users can filter products by category and search query. Each product card includes 
 *   an image, price, category, and buttons to add the product to the cart or view it on Amazon. 
 *   Clicking on the product card opens a product details modal (handled by the parent component).
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Integrated category and search filtering, added animations, 
 *   and improved the UI layout and styling.
 * Preconditions:
 *   - A React environment is set up.
 *   - Backend endpoint `http://localhost:3000/api/items` must return a list of products.
 *   - `addToCart` and `setSelectedProduct` callbacks must be provided by the parent.
 * Acceptable and unacceptable input values or types:
 *   - `selectedCategory`: string that determines which category is selected ("All" means no filter).
 *   - `searchQuery`: string used to filter products by name.
 *   - `addToCart`: function that takes a Product and adds it to the cart.
 *   - `setSelectedProduct`: function that sets a selected product, typically to show a details modal.
 * Postconditions:
 *   - Renders a grid of filtered products.
 *   - Provides interactive buttons to add items to cart or view on Amazon.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If the fetch fails, an error message is displayed.
 *   - If loading is in progress, a loading indicator is shown.
 * Side effects:
 *   - Fetches data from the backend using React Query.
 * Invariants:
 *   - The product layout remains consistent; filters only affect which products are shown.
 * Any known faults:
 *   - If the API endpoint changes or returns invalid data, the component may break.
 * Comments summarizing major blocks of code:
 *   - useQuery hook: Fetches products from the server.
 *   - Loading and error states: Display messages accordingly.
 *   - Filtering logic: Filters products by category and name based on `selectedCategory` and `searchQuery`.
 *   - Product card: Displays product info, add-to-cart button, and Amazon link. Clicking card shows details modal.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import necessary hooks and types
import { useQuery } from '@tanstack/react-query';  // For data fetching and caching
import { motion } from 'framer-motion';             // For UI animations
import { ShoppingCart } from 'lucide-react';        // Icon for cart button
import type { Product } from '../types';            // Product type definition

// Props for ProductGrid component
interface ProductGridProps {
  selectedCategory: string; // Current category filter, "All" means no category filter
  searchQuery: string;      // Current search query to filter product names
  addToCart: (product: Product) => void;            // Adds selected product to the cart
  setSelectedProduct: (product: Product | null) => void; // Sets a product to show details in a modal
}

/**
 * ProductGrid component:
 * Fetches products from an API and displays them in a grid. Filters by category and search query.
 * Each product card can be clicked to show details, or a user can directly add the product to the 
 * cart or visit its Amazon link.
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory,
  searchQuery,
  addToCart,
  setSelectedProduct,
}) => {
  // Use React Query to fetch product data
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'], // Unique key for caching
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/items');
      if (!response.ok) {
        // If response is not ok, throw an error to trigger error state
        throw new Error('Failed to fetch products');
      }
      // Return parsed JSON array of products
      return response.json();
    },
  });

  // Show loading indicator while products are being fetched
  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-400">
        {/* Spinning loader animation */}
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
        Loading products...
      </div>
    );
  }

  // Show error message if there's a problem fetching products
  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error loading products. Please try again later.
      </div>
    );
  }

  // Filter products by selected category and search query
  const filteredProducts = products.filter(
    (product: Product) =>
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      {/* Responsive grid for product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <motion.div
            key={product.id} // Unique key for each product
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden 
                      border border-gray-700/50 flex flex-col cursor-pointer"
            // Slight upward hover animation for product card
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProduct(product)} // On click, show product details
          >
            {/* Image Container */}
            <div className="relative h-48 bg-white">
              <img 
                src={product.img} 
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
              {/* Price tag in top-right corner */}
              <div className="absolute top-2 right-2 bg-gradient-to-r from-teal-500 to-cyan-400 
                           px-3 py-1 rounded-full text-sm font-bold text-gray-900">
                {product.price}
              </div>
            </div>

            {/* Content Container: Product name, category, and buttons */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Product name */}
              <h3 className="text-lg font-semibold text-teal-400 mb-1 line-clamp-1">
                {product.name}
              </h3>
              {/* Product category */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {product.category}
              </p>

              {/* Action Buttons: Add to Cart and Amazon link */}
              <div className="mt-auto flex gap-2">
                {/* Add to Cart button: Stop propagation so card click doesn't open details */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from opening modal
                    addToCart(product);   // Add product to the cart
                  }}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-400 
                         text-gray-900 px-3 py-2 rounded-lg font-medium text-sm
                         hover:from-teal-400 hover:to-cyan-300 
                         transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>

                {/* Amazon link: Also stop propagation to avoid opening details modal */}
                <motion.a
                  href={product.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-2 bg-[#FF9900] text-white rounded-lg text-sm
                         hover:bg-[#FF9900]/90 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Amazon
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


// import { useQuery } from '@tanstack/react-query';
// import { motion } from 'framer-motion';
// import { ShoppingCart } from 'lucide-react';
// import type { Product } from '../types';

// interface ProductGridProps {
//   selectedCategory: string;
//   searchQuery: string;
//   addToCart: (product: Product) => void;
//   setSelectedProduct: (product: Product | null) => void;
// }

// export const ProductGrid: React.FC<ProductGridProps> = ({
//   selectedCategory,
//   searchQuery,
//   addToCart,
//   setSelectedProduct,
// }) => {
//   const { data: products = [], isLoading, error } = useQuery({
//     queryKey: ['products'],
//     queryFn: async () => {
//       const response = await fetch('http://localhost:3000/api/items');
//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }
//       return response.json();
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="text-center py-12 text-gray-400">
//         <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
//         Loading products...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12 text-red-400">
//         Error loading products. Please try again later.
//       </div>
//     );
//   }

//   const filteredProducts = products.filter(
//     (product: Product) =>
//       (selectedCategory === 'All' || product.category === selectedCategory) &&
//       product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredProducts.map((product: Product) => (
//           <motion.div
//             key={product.id}
//             className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden 
//                       border border-gray-700/50 flex flex-col cursor-pointer"
//             whileHover={{ y: -4 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => setSelectedProduct(product)} // Add this line
//           >
//             {/* Image Container */}
//             <div className="relative h-48 bg-white">
//               <img 
//                 src={product.img} 
//                 alt={product.name}
//                 className="w-full h-full object-contain p-4"
//               />
//               <div className="absolute top-2 right-2 bg-gradient-to-r from-teal-500 to-cyan-400 
//                            px-3 py-1 rounded-full text-sm font-bold text-gray-900">
//                 {product.price}
//               </div>
//             </div>

//             {/* Content Container */}
//             <div className="p-4 flex flex-col flex-grow">
//               <h3 className="text-lg font-semibold text-teal-400 mb-1 line-clamp-1">
//                 {product.name}
//               </h3>
//               <p className="text-sm text-gray-400 mb-4 line-clamp-2">
//                 {product.category}
//               </p>

//               {/* Buttons */}
//               <div className="mt-auto flex gap-2">
//                 <motion.button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     addToCart(product);
//                   }}
//                   className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-400 
//                          text-gray-900 px-3 py-2 rounded-lg font-medium text-sm
//                          hover:from-teal-400 hover:to-cyan-300 
//                          transition-all duration-300 flex items-center justify-center gap-2"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <ShoppingCart className="w-4 h-4" />
//                   Add to Cart
//                 </motion.button>
//                 <motion.a
//                   href={product.URL}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   onClick={(e) => e.stopPropagation()}
//                   className="px-3 py-2 bg-[#FF9900] text-white rounded-lg text-sm
//                          hover:bg-[#FF9900]/90 transition-colors duration-300"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   Amazon
//                 </motion.a>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };
