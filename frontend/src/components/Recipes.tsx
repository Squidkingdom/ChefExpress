import React from "react";
import "react-toastify/dist/ReactToastify.css";
import RecipeCard, { Recipe } from "../subcomponents/RecipeCard";
import { useQuery } from "@tanstack/react-query";



export const Recipes: React.FC = () => {

    const fetchRecipes = async () => {
        const response = await fetch("http://localhost:3000/api/recipe", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch videos");
        }
        return response.json();
    }

    const { data: sharedRecipes = [], isLoading, isError, error } = useQuery<Recipe[], Error>({
        queryKey: ["precipes"],
        queryFn: fetchRecipes,
        initialData: [],
    })

    return (
        <>
            {sharedRecipes.length === 0 ? (
                <p className="text-center text-gray-400">No recipes shared yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sharedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </>

    )
};