/***************************************************************************************************
 * Name of code artifact: SearchBar.tsx
 * Brief description of what the code does:
 *   This component renders a search bar with a dynamic, blurred background that adjusts its appearance
 *   when the user has scrolled down. As the user types their query, the search input is debounced to 
 *   reduce unnecessary state updates. A clear button allows users to quickly reset the search field.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/7/24
 * Dates the code was revised: 11/26/24
 * Brief description of each revision & author:
 *   11/26/24 - Brady Holland: Implemented debouncing for the search input, improved styling and 
 *   transitions, and added a clear button for user convenience.
 * Preconditions:
 *   - `searchQuery` must be a string representing the current global or parent-level search query.
 *   - `setSearchQuery` must be a function that updates the parent-level search query state.
 *   - `scrolled` must be a boolean indicating whether the user has scrolled enough to change 
 *     the search bar's appearance.
 * Acceptable and unacceptable input values or types:
 *   - `searchQuery`: A string; can be empty or contain any search terms.
 *   - `setSearchQuery`: A function that accepts a string to update the search query.
 *   - `scrolled`: A boolean; true if the user has scrolled, false otherwise.
 * Postconditions:
 *   - Displays a search input that debounces user input and updates `searchQuery` after 300ms.
 *   - If `scrolled` is true, the background and border styles shift to a "scrolled" state.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - None explicitly handled; if `setSearchQuery` is not a function, the search cannot update.
 * Side effects:
 *   - Debouncing user input to reduce rapid state updates in the parent component.
 * Invariants:
 *   - The visual layout of the search bar remains consistent. Debouncing ensures controlled updates.
 * Any known faults:
 *   - None known at this time.
 * Comments summarizing major blocks of code:
 *   - useDebounce: Delays updating the global search query to prevent immediate re-renders.
 *   - handleClear: Resets the search field to an empty string.
 *   - Conditional rendering of the clear button only when there is input.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import React hooks and types
import React from "react";
// Import icons from lucide-react for search and clear (X) icons
import { Search, X } from "lucide-react";
// Import useDebounce hook for delayed input updates
import { useDebounce } from 'use-debounce';

// Define props for the SearchBar component
interface SearchBarProps {
  searchQuery: string;           // Current global search query
  setSearchQuery: (query: string) => void; // Function to update the global search query
  scrolled: boolean;             // Boolean to toggle styling based on scroll state
}

/**
 * SearchBar component:
 * Renders a styled search input field that debounces user input before calling `setSearchQuery`.
 * A clear button resets the input. The background styling changes when `scrolled` is true.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  scrolled,
}) => {
  // Local state mirrors the global searchQuery for immediate updates without lag
  const [localQuery, setLocalQuery] = React.useState(searchQuery);
  // Debounce localQuery changes by 300ms to reduce spamming setSearchQuery calls
  const [debouncedValue] = useDebounce(localQuery, 300);

  // Update the parent searchQuery when the debounced value changes
  React.useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  // Handler for input change events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  // Clears the input and global search query
  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className="w-96 relative">
      {/* Background and border styling, changes on scroll */}
      <div 
        className={`absolute inset-0 rounded-lg backdrop-blur-lg transition-all duration-500 ease-in-out
          ${scrolled 
            ? "bg-gray-900/80 shadow-lg shadow-gray-900/20 border border-gray-700/20" 
            : "bg-gray-800/50 border border-gray-700/50"}
        `}
      />
      <div className="relative">
        {/* Search input field */}
        <input
          type="text"
          value={localQuery}
          onChange={handleChange}
          placeholder="Search for kitchen tools..."
          className="w-full pl-10 pr-10 py-2.5 bg-transparent border border-gray-700/50 rounded-lg
                   text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-500/50
                   focus:border-transparent transition-all duration-300 text-sm"
        />
        {/* Search icon on the left inside the input */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        
        {/* Clear button appears only if there's input */}
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
