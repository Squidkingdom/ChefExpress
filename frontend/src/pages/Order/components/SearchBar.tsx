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
    <div className="w-96 relative">
      <div 
        className={`absolute inset-0 rounded-lg backdrop-blur-lg transition-all duration-500 ease-in-out
          ${scrolled 
            ? "bg-gray-900/80 shadow-lg shadow-gray-900/20 border border-gray-700/20" 
            : "bg-gray-800/50 border border-gray-700/50"}
        `}
      />
      <div className="relative">
        <input
          type="text"
          value={localQuery}
          onChange={handleChange}
          placeholder="Search for kitchen tools..."
          className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-gray-700/50 rounded-lg
                   text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/50
                   focus:border-transparent transition-all duration-300 text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        {localQuery && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button
              onClick={handleClear}
              className="p-0.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-600/50 
                       hover:text-gray-200 transition-colors duration-200 hover:scale-110
                       active:scale-95 transform"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};