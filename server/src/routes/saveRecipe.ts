import express, { NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from "../db/client";  // Import prisma client to interact with the database

const router = express.Router();  // Create an express router for handling requests

// Create a logger for this file
const logger = log4js.getLogger("saveRecipe.ts");

// Define the /saveRecipe route that listens for POST requests
router.route("/").post(async (req: Request, res: Response): Promise<void> => {
  const { user_id, recipe_id } = req.body;  // Extract user_id and recipe_id from the request body

  logger.info(`Attempting to save recipe with ID: ${recipe_id} for user: ${user_id}`);

  try {
    // Check if the user already saved the recipe (this prevents duplicates)
    const existingSave = await prisma.saved_recipes.findUnique({
      where: {
        user_id_recipe_id: {
          user_id: user_id,
          recipe_id: recipe_id,
        },
      },
    });

    // If the recipe is already saved by this user, return a message
    if (existingSave) {
      res.status(400).json({ error: "Recipe already saved by this user" });
      return;  // Ensure no further code runs if the recipe is already saved
    }

    // If not, save the recipe for the user
    const savedRecipe = await prisma.saved_recipes.create({
      data: {
        recipe_id: recipe_id,  // Save the recipe ID
        user_id: user_id,      // Save the user ID
      },
    });

    // Log the successful save operation
    logger.info(`Successfully saved recipe with ID: ${savedRecipe.recipe_id} for user: ${savedRecipe.user_id}`);

    // Return a success message
    res.status(200).json({ message: "Recipe saved successfully" });

  } catch (error) {
    // Log any errors and return a 500 internal server error
    console.error("Error saving recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})
  .get(async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;

      if (!userId) {
        res.status(400).json({ error: "User ID is required." });
        return
      }

      // Fetch all saved recipes for the user
      const savedRecipes = await prisma.saved_recipes.findMany({
        where: {
          user_id: String(userId),
        },
        include: {
          Recipe: {
            include: {
              ingrediantinrecipe: {
                include: {
                  Ingredient: true
                }
              }
            }
          },
        }
      });

      // If no saved recipes are found
      if (savedRecipes.length === 0) {
        res.status(404).json({ message: "No saved recipes found for this user." });
        return
      }


      // Return saved recipes with associated recipe data
      const newRecipes = savedRecipes.map((savedRecipe) => {
        return {
          ...savedRecipe.Recipe,
          image: savedRecipe.Recipe.image? `data:image/jpeg;base64,${Buffer.from(savedRecipe.Recipe.image).toString('base64')}` : null,
          ingredients: savedRecipe.Recipe.ingrediantinrecipe.map((ingredient) => {
            return {
              name: ingredient.Ingredient.name,
              quantity: ingredient.quantity,
            }
          }),
        }
      });
      res.status(200).json(newRecipes);
      return
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      res.status(500).json({ error: "An unexpected error occurred." });
      return
    }
  });

export default router;  // Export the router to use in other parts of the application
