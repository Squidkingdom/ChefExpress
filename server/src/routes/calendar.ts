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
      const calendarEntries = await prisma.calendar.findMany();
      logger.info(`Retrieved ${calendarEntries.length} calendar entries`);
      res.status(200).json(calendarEntries);
    } catch (error) {
      // Log the error and respond with a 500 status
      logger.error("Error fetching calendar entries:", error);
      res.status(500).json({ error: "Failed to fetch calendar entries" });
    }
  })
  // POST: Create a new calendar entry
  .post(async (req: Request, res: Response): Promise<void> => {
    const { owner_id, recipe_id, date_saved, meal } = req.body;

    // Validate required fields
    if (!owner_id || !date_saved || !meal) {
      res.status(400).json({ error: "owner_id, date_saved, and meal are required" });
      return;
    }

    try {
      // Create a new calendar entry in the database
      const newEntry = await prisma.calendar.create({
        data: {
          owner_id,
          recipe_id,
          date_saved,
          meal,
        },
      });
      logger.info(`Created new calendar entry for owner_id: ${owner_id}`);
      res.status(201).json(newEntry);
    } catch (error) {
      // Log the error and respond with a 500 status
      logger.error("Error creating calendar entry:", error);
      res.status(500).json({ error: "Failed to create calendar entry" });
    }
  });

export default router;
