import express, { NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from "../db/client";

// Create a new express router
const router = express.Router();

// Create a logger for the file 'recipe.ts'
const logger = log4js.getLogger("recipe.ts");


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
          image: recipe.image? `data:image/jpeg;base64,${Buffer.from(recipe.image).toString('base64')}` : null
        };
      });

      // Return the list of recipes
      res.status(200).json(newRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  })
  .post(async (req: Request, res: Response) => {
    try {
      // Parse data from the request body
      const { ingredients, title, description, owner_id } = req.body;
  
      // Step 1: Process the ingredients
      const ingredientData: { ingredient_id: string; quantity: string }[] = [];
  
      for (const ingredient of ingredients) {
        const { name, quantity } = ingredient;
  
        // Search for the ingredient in the Ingredient table
        let existingIngredient = await prisma.ingredient.findFirst({
          where: { name },
        });
  
        if (!existingIngredient) {
          // Create new ingredient if not found
          const newIngredient = await prisma.ingredient.create({
            data: {
              name,
              ingredient_id: Math.random().toString(36).substring(2, 15), // Generate random ingredient_id
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
      const recipeId = Math.random().toString(36).substring(2, 15); // Generate random recipe_id
  
      const newRecipe = await prisma.recipe.create({
        data: {
          recipe_id: recipeId, // Random recipe_id
          name: title, // Name from POST request body
          instructions: description, // Instructions from POST request body
          owner_id, // owner_id from POST request body
        },
      });
  
      // Step 3: Add entries to the ingrediantinrecipe table
      const ingredientInRecipeEntries = ingredientData.map(async (ingredient) => {
        return prisma.ingrediantinrecipe.create({
          data: {
            recipe_id: recipeId,
            ingredient_id: ingredient.ingredient_id,
            quantity: ingredient.quantity,
          },
        });
      });
  
      // Wait for all the ingrediantinrecipe entries to be created
      await Promise.all(ingredientInRecipeEntries);
  
      // Send a response indicating success
      res.status(200).json({
        message: "Recipe and ingredient entries created successfully",
        recipe: newRecipe,
        ingredients: ingredientData,
      });
    } catch (error) {
      console.error("Error creating recipe and ingredients:", error);
      res.status(500).json({ error: "Failed to create recipe and ingredients" });
    }
  });
export default router;
