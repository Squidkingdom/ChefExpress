// src/components/Recipes.tsx
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import RecipeCard, { Recipe } from "../subcomponents/RecipeCard";
import { useQuery } from "@tanstack/react-query";

interface RecipesDisplayProps {
    isSavedRecipes?: boolean;
}

export const Recipes: React.FC<RecipesDisplayProps> = ({ isSavedRecipes = false }) => {

    // Fetches the list of recipes from the backend API
    const fetchRecipes = async () => {
        const token = localStorage.getItem("token");

        let ownerIdQuery = "";

        if (isSavedRecipes) {
            // If there's no token, return an empty array early
            if (!token) {
                return [];
            }

            // Construct the query parameter for authenticated requests
            ownerIdQuery = `?owner_id_ref=${token}`;
        }

        const response = await fetch(`http://localhost:3000/api/recipe${ownerIdQuery}`, {
            method: "GET"
        });

        if (!response.ok) {
            // Throw an error if the fetch operation fails
            throw new Error("Failed to fetch recipes");
        }
        // Parse the response body as JSON
        return response.json();
    }

    // React Query hook to manage recipe fetching
    const { data: sharedRecipes = [] } = useQuery<Recipe[], Error>({
        queryKey: [`${isSavedRecipes ? 'u_' : ''}recipes`], 
        queryFn: fetchRecipes, 
        initialData: [], 
    });

    return (
        <>
            {sharedRecipes.length === 0 ? (
                <p className="text-center text-gray-400">No recipes yet.</p>
            ) : (
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {sharedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </>
    );
};
