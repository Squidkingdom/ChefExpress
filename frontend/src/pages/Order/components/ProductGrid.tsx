// ProductGrid Component
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import type { Product } from '../types';

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
  setSelectedProduct: (product: Product | null) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory,
  searchQuery,
  setSelectedProduct,
}) => {
  const { data: products = [], isLoading, error } = useQuery({
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
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error loading products. Please try again later.
      </div>
    );
  }

  const filteredProducts = products.filter(
    (product: Product) =>
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <motion.div
            key={product.id}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden 
                      border border-gray-700/50 flex flex-col cursor-pointer max-w-sm mx-auto w-full"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProduct(product)}
          >
            {/* Image Container */}
            <div className="relative h-48 bg-white">
              <img 
                src={product.img} 
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
              <div className="absolute top-2 right-2 bg-gradient-to-r from-teal-500 to-cyan-400 
                           px-3 py-1 rounded-full text-sm font-bold text-gray-900">
                {product.price}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-teal-400 mb-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {product.category}
              </p>

              {/* Amazon Button */}
              <div className="mt-auto flex justify-center">
                <motion.a
                  href={product.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-6 py-2.5 bg-[#FF9900] text-white rounded-lg text-sm font-medium
                         hover:bg-[#FF9900]/90 transition-colors duration-300 w-full text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Go to Amazon
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

