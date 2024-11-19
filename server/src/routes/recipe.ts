import express, { NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from "../db/client";

const router = express.Router();

// Create a logger for the file 'recipe.ts'
const logger = log4js.getLogger("recipe.ts");

// /api/recipe/
router.route("/")
  .all((req: Request, res: Response, next: NextFunction) => {
    logger.info("Request to /api/recipe/");
    console.log("Request to /api/recipe/");
    next();
  })
  .post(async (req: Request, res: Response) => {
    // Fetch all existing recipes using findMany() without including related models
    const recipes = await prisma.recipe.findMany();

    // Return the list of recipes
    res.status(200).json(recipes);
  });

export default router;
