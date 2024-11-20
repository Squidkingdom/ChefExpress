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
  .post(async (req: Request, res: Response) => {
    // Fetch all existing recipes using findMany() without including related models
    const recipes = await prisma.recipe.findMany();

    // Return the list of recipes
    res.status(200).json(recipes);
  });

export default router;
