import express, { NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from "../db/client";

const router = express.Router();

// Create a logger for the file 'calendar.ts'
const logger = log4js.getLogger("calendar.ts");

// Route handler for the /api/calendar endpoint
router
  .route("/")
  // Middleware for logging all requests to /api/calendar
  .all((req: Request, res: Response, next: NextFunction) => {
    logger.info("Request to /api/calendar");
    next();
  })
  // GET: Retrieve all calendar entries
  .get(async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all records from the 'calendar' table
      const calendarMeals = await prisma.calendar.findMany({
        where: {
          owner_id: req.query.owner_id as string,
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

      const inMealFormat = calendarMeals.map((meal) => {
        return {
          owner_id: meal.owner_id,
          date_saved: meal.date_saved,
          type: meal.meal,
          recipe: {
            id: meal.recipe_id,
            name: meal.Recipe?.name,
            image: "",
            ingredients: meal.Recipe?.ingrediantinrecipe.map((ingrediant) => {
              return {
                name: ingrediant.Ingredient?.name,
                quantity: ingrediant.quantity,
              }
            }),
            instructions: meal.Recipe?.instructions
          }
        }
      })

        logger.info(`Retrieved ${calendarMeals.length} calendar entries`);
      res.status(200).json(inMealFormat);
    } catch (error) {
      // Log the error and respond with a 500 status
      logger.error("Error fetching calendar entries:", error);
      res.status(500).json({ error: "Failed to fetch calendar entries" });
    }
  })
  // POST: Create a new calendar entry
  .post(async (req: Request, res: Response): Promise<void> => {
    const { owner_id, recipe_id, date_saved, type } = req.body;

    // Validate required fields
    if (!owner_id || !date_saved || !type) {
      res.status(400).json({ error: "owner_id, date_saved, and meal are required" });
      return;
    }

    try {

      // Check if the recipe_id exists in the calendar database for the specific owner, date, and type. If so update the recipe_id
      const existingEntry = await prisma.calendar.findFirst({
        where: {
          owner_id,
          date_saved,
          meal: type,
        },
      });

      if (existingEntry) {
        const updatedEntry = await prisma.calendar.update({
          where: {
            meal_date_saved_owner_id: {
              meal: existingEntry.meal,
              date_saved: existingEntry.date_saved,
              owner_id: existingEntry.owner_id
            }
          },
          data: {
            recipe_id: recipe_id,
          },
        });
        logger.info(`Updated existing calendar entry for owner_id: ${owner_id}`);
        res.status(200).json(updatedEntry);
        return;
      } else {
        const newEntry = await prisma.calendar.create({
          data: {
            owner_id,
            recipe_id,
            date_saved,
            meal: type,
          },
        });
        logger.info(`Created new calendar entry for owner_id: ${owner_id}`);
        res.status(201).json(newEntry);
      }

    } catch (error) {
      // Log the error and respond with a 500 status
      logger.error("Error creating calendar entry:", error);
      res.status(500).json({ error: "Failed to create calendar entry" });
    }
  })

router
  .route("/:owner_id/:date_saved/:meal")
  .delete(async (req: Request, res: Response): Promise<void> => {
    const { owner_id, date_saved, meal } = req.params;
    const respond = await prisma.calendar.delete({
      where: {
        meal_date_saved_owner_id: {
          meal: meal,
          date_saved: date_saved,
          owner_id: owner_id
        }
      }
    });
    res.status(200).json({message: "Deleted"});
  })

  
  
  ;

export default router;
