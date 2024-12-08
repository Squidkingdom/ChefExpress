import express, { NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from "../db/client"; // Import prisma client to interact with the database

const router = express.Router(); // Create an express router for handling requests

// Create a logger for this file
const logger = log4js.getLogger("ownedRecipes.ts");

// Define the /ownedRecipes route that listens for GET requests
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info("Received request to fetch owned recipes"); // Log the incoming request

  try {
    const ownerIdRef = req.query.owner_id_ref as string | undefined; // Extract owner_id_ref from the query parameters

    // Validate the owner_id_ref parameter
    if (!ownerIdRef) {
      logger.warn("Missing owner_id_ref query parameter"); // Log the missing parameter warning
      res.status(400).json({ error: "owner_id_ref query parameter is required" });
      return; // Exit the function early if the parameter is missing
    }

    // Fetch recipes where owner_id matches the provided owner_id_ref
    const recipes = await prisma.recipeview.findMany({
      where: {
        owner_id: ownerIdRef,
      },
    });

    // Process the recipes to include image encoding if applicable
    const processedRecipes = recipes.map((recipe) => ({
      ...recipe,
      image: recipe.image ? `data:image/jpeg;base64,${Buffer.from(recipe.image).toString("base64")}` : null,
    }));

    logger.info(`Fetched ${processedRecipes.length} recipes for owner_id: ${ownerIdRef}`); // Log the number of recipes fetched

    // Return the processed recipes to the client
    res.status(200).json(processedRecipes);
  } catch (error) {
    // Log any errors and return a 500 internal server error
    logger.error("Error fetching owned recipes:", error);
    res.status(500).json({ error: "Failed to fetch owned recipes" });
  }
});

export default router; // Export the router to use in other parts of the application
