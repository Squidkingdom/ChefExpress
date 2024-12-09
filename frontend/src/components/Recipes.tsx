/***************************************************************************************************
 * Name of code artifact: Recipes.tsx
 * Brief description of what the code does:
 *   This component fetches and displays a list of recipes, either all shared recipes or the user's 
 *   saved recipes depending on the `isSavedRecipes` prop. It uses React Query to manage data 
 *   fetching and caching. If the `isSavedRecipes` prop is true and a user token is present, it 
 *   fetches that user's saved recipes; otherwise, it fetches shared recipes. Each recipe is 
 *   displayed using a RecipeCard component.
 * Programmer’s name: Brady Holland
 * Date the code was created: 11/2/24
 * Dates the code was revised: 11/16/24
 * Brief description of each revision & author:
 *   11/16/24 - Brady Holland: Integrated authentication logic for fetching saved recipes and handled 
 *   empty states and errors more gracefully.
 * Preconditions:
 *   - React environment and dependencies are set up (React Query, fetch API).
 *   - Local storage may contain a "token" if the user is authenticated.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - `isSavedRecipes` (boolean): if true, fetch only saved recipes for the current user; otherwise, 
 *     fetch shared/public recipes. Defaults to false.
 *   - If `isSavedRecipes` is true and no token is found in localStorage, returns an empty array (no recipes).
 * Postconditions:
 *   - Renders a list of RecipeCards or a message if no recipes are found.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - If the fetch fails, it throws an error which React Query can log or handle.
 * Side effects:
 *   - Fetching data from a remote endpoint.
 * Invariants:
 *   - The grid layout for recipes remains consistent. 
 * Any known faults:
 *   - If the API endpoint or response format changes, this component may break.
 * Comments summarizing major blocks of code:
 *   - `fetchRecipes`: Fetches recipes from the backend, constructing URL parameters based on 
 *     `isSavedRecipes` and token availability.
 *   - `useQuery`: Utilizes React Query to manage and cache fetch results.
 *   - Conditional rendering: If no recipes, show a message; otherwise, display a grid of RecipeCards.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// src/components/Recipes.tsx

import React from "react";
import "react-toastify/dist/ReactToastify.css"; // Styles for toast notifications (used if needed)
import RecipeCard, { Recipe } from "../subcomponents/RecipeCard"; // Imports the RecipeCard component and Recipe type
import { useQuery } from "@tanstack/react-query";

// Props interface for the Recipes component
interface RecipesDisplayProps {
    isSavedRecipes?: boolean; // Determines if we fetch saved recipes (true) or shared recipes (false)
}

// Recipes component displays either shared or saved recipes in a grid.
export const Recipes: React.FC<RecipesDisplayProps> = ({ isSavedRecipes = false }) => {

    /**
     * fetchRecipes function:
     * Fetches the list of recipes from the backend API. If `isSavedRecipes` is true and a token
     * is found, includes the owner's token in the query params to fetch only that user's saved recipes.
     * Otherwise, fetches shared recipes.
     */
    const fetchRecipes = async () => {
        // Retrieve token from local storage if available
        const token = localStorage.getItem("token");

        let ownerIdQuery = "";

        // If isSavedRecipes is true, we attempt to fetch user's saved recipes.
        if (isSavedRecipes) {
            // If there's no token, the user is not authenticated, so return an empty array early.
            if (!token) {
                return [];
            }

            // Construct the query parameter for authenticated requests
            ownerIdQuery = `?owner_id_ref=${token}`;
        }

        // Perform GET request to fetch recipes (either shared or saved)
        const response = await fetch(`http://localhost:3000/api/recipe${ownerIdQuery}`, {
            method: "GET"
        });

        // Check if the response is okay, otherwise throw an error
        if (!response.ok) {
            throw new Error("Failed to fetch recipes");
        }

        // Parse and return the JSON response (array of recipes)
        return response.json();
    }

    // Use React Query to manage the fetching process and caching.
    // queryKey changes if we are fetching user recipes (`u_recipes`) or shared recipes (`recipes`).
    const { data: sharedRecipes = [] } = useQuery<Recipe[], Error>({
        queryKey: [`${isSavedRecipes ? 'u_' : ''}recipes`], 
        queryFn: fetchRecipes, 
        initialData: [], 
    });

    return (
        <>
            {/* If no recipes are returned, display a placeholder message */}
            {sharedRecipes.length === 0 ? (
                <p className="text-center text-gray-400">No recipes yet.</p>
            ) : (
                // Otherwise, display a grid of RecipeCards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sharedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </>
    );
};
