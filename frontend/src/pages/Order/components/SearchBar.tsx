import React from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scrolled: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  scrolled,
}) => {
  const [localQuery, setLocalQuery] = React.useState(searchQuery);
  const [debouncedValue] = useDebounce(localQuery, 300);

  React.useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <div 
        className={`absolute inset-0 rounded-xl backdrop-blur-lg transition-all duration-500 ease-in-out
          ${scrolled 
            ? "bg-gray-900/80 shadow-lg shadow-gray-900/20 border-gray-700/20" 
            : "bg-transparent border-transparent"}
        `}
      />
      <div className="relative">
        <input
          type="text"
          value={localQuery}
          onChange={handleChange}
          placeholder="Search for kitchen tools..."
          className="w-full pl-12 pr-12 py-4 bg-transparent border border-gray-700/50 rounded-xl
                   text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/50
                   focus:border-transparent transition-all duration-300"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        {localQuery && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={handleClear}
              className="p-1 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 
                       hover:text-gray-200 transition-colors duration-200 hover:scale-110
                       active:scale-95 transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};