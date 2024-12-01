import express, { NextFunction, Request, Response } from "express"; 
import log4js from "log4js"; 
import { prisma } from "../db/client";  // Import prisma client to interact with the database

const router = express.Router();  // Create an express router for handling requests

// Create a logger for this file
const logger = log4js.getLogger("saveRecipe.ts");

// Define the /saveRecipe route that listens for POST requests
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { user_id, recipe_id } = req.body;  // Extract user_id and recipe_id from the request body

  logger.info(`Attempting to save recipe with ID: ${recipe_id} for user: ${user_id}`);

  try {
    // Check if the user already saved the recipe (this prevents duplicates)
    const existingSave = await prisma.saved_recipes.findUnique({
      where: {
        recipe_id_user_id: {
          recipe_id: recipe_id,  // Check if this combination already exists
          user_id: user_id,
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
    res.status(201).json({ message: "Recipe saved successfully" });

  } catch (error) {
    // Log any errors and return a 500 internal server error
    console.error("Error saving recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;  // Export the router to use in other parts of the application
