import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import log4js from "log4js";
import { prisma } from "../db/client";

// Create a new express router
const router = express.Router();

// Create a logger for the file 'recipe.ts'
const logger = log4js.getLogger("recipe.ts");

// Configure Multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Extend Request type to include 'file' property for TypeScript
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Handle POST request to /api/recipeImage for image upload
// (From the first snippet; DO NOT remove or change comments)
 
/**
 *                                     RECIPE  /api/recipe
 * 
 * METHODS:
 *    POST: Fetch all recipes
 *        Parameters: None
 *        Returns: Array of recipe dictionaries in the form:
 *       
        [
          {
              "name": string,
              "instructions": string,
              "recipe_id": string // (1.1, 1.2, 2.2 Idk really know why it is, ask kansas.)
          },
          {
              etc...
          }
        ]
        GET, PUT, DELETE:  Not implemented
 * 
 */

router.route("/")
  .all((req: Request, res: Response, next: NextFunction) => {
    // logging the request
    logger.info("Request to /api/recipe/");
    console.log("Request to /api/recipe/");

    // Pass to Method
    next();
  })
  .get(async (req: Request, res: Response) => {
    try {
      // Extract the owner_id_ref parameter from the query string
      const ownerIdRef = req.query.owner_id_ref as string | undefined;
  
      // Check if owner_id_ref is provided
      const recipes = await prisma.recipeview.findMany({
        where: ownerIdRef
          ? {
              // If owner_id_ref is provided, return recipes with matching owner_id
              owner_id: ownerIdRef,
            }
          : undefined, // If owner_id_ref is not provided, fetch all recipes
      });
  
      const newRecipes = recipes.map((recipe) => {
        return {
          ...recipe,
          image: recipe.image ? `data:image/jpeg;base64,${Buffer.from(recipe.image).toString('base64')}` : null
        };
      });

      // Return the list of recipes
      res.status(200).json(newRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  })
  .post(upload.single("image"), async (req: MulterRequest, res: Response) => {
    // Below code merges logic from both endpoints:
    // First, we create a recipe and its ingredients as from the second snippet.
    // Then, if an image is provided, we handle it as in the first snippet.
    
    try {
      // Parse data from the request body
      const { ingredients, title, instructions, description, owner_id } = req.body;

      // Step 1: Process the ingredients
      const ingredientData: { ingredient_id: number; quantity: string }[] = [];
  
      for (const ingredient of JSON.parse(ingredients)) {
        const { name, quantity } = ingredient;
  
        // Search for the ingredient in the Ingredient table
        let existingIngredient = await prisma.ingredient.findFirst({
          where: { name },
        });
  
        if (!existingIngredient) {
          // Create new ingredient if not found
          const newIngredient = await prisma.ingredient.create({
            data: {
              name: name,
            },
          });
          existingIngredient = newIngredient;
        }
  
        // Push the ingredient_id and quantity to the array
        ingredientData.push({
          ingredient_id: existingIngredient.ingredient_id,
          quantity,
        });
      }
  
      // Step 2: Add entry to the Recipe table
      // We no longer manually generate a recipe_id. The DB will handle it and return `id`.
      let newRecipe = await prisma.recipe.create({
        data: {
          name: title, // Name from POST request body
          instructions: instructions, // Instructions from POST request body
          owner_id: owner_id, // owner_id from POST request body
          description: description, // Description from POST request body
        },
      });
  
      // Step 3: Add entries to the ingrediantinrecipe table using newRecipe.id
      const ingredientInRecipeEntries = ingredientData.map(async (ingredient) => {
        console.log(`${newRecipe.id} ${ingredient.ingredient_id}`)
        return prisma.ingrediantinrecipe.create({
          data: {
            recipe_id: newRecipe.id,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity,
          },
        });
      });
  
      // Wait for all the ingrediantinrecipe entries to be created
      await Promise.all(ingredientInRecipeEntries);

      // Now integrate image upload logic from the first snippet
      const file = req.file;

      // Check if a file was uploaded
      if (!file) {
        // If no image, just respond with the newly created recipe info
        res.status(200).json({
          message: "Recipe and ingredient entries created successfully",
          recipe: newRecipe,
          ingredients: ingredientData,
        });
        return;
      }

      // Try updating the recipe with the image (from first snippet)
      try {
        const updatedRecipe = await prisma.recipe.update({
          where: { id: newRecipe.id },
          data: {
            image: file.buffer, // Save the image as binary data
          },
        });

        // Return the updated recipe with the id (from first snippet)
        res.sendStatus(200);
      } catch (error) {
        console.error("Error updating recipe image:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }

    } catch (error) {
      console.error("Error creating recipe and ingredients:", error);
      res.status(500).json({ error: "Failed to create recipe and ingredients" });
    }
  });

export default router;
