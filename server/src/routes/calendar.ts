/*
  Calendar route handling for Chef Express.
  This file defines the endpoints for managing calendar entries,
  allowing users to retrieve and create calendar entries for meal planning.

  Programmer: Blake, Brady
  Date Created: 12/4/24
  Last Revised: 12/8/24
*/

// Import necessary modules for routing, logging, and Prisma client
import express, { NextFunction, Request, Response } from "express"; // Express for routing
import log4js from "log4js"; // log4js for logging
import { prisma } from "../db/client"; // Prisma client for database interaction

// Initialize an express router for the calendar routes
const router = express.Router();

// Create a logger specifically for the calendar routes
const logger = log4js.getLogger("calendar.ts");

// Route handler for the /api/calendar endpoint
router
  .route("/")
  // Middleware to log all incoming requests to /api/calendar
  .all((req: Request, res: Response, next: NextFunction) => {
    logger.info("Request to /api/calendar");
    next(); // Pass control to the next middleware or route handler
  })
  // GET: Retrieve all calendar entries from the database
  .get(async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all calendar entries from the 'calendar' table
      const calendarEntries = await prisma.calendar.findMany();
      logger.info(`Retrieved ${calendarEntries.length} calendar entries`);
      res.status(200).json(calendarEntries); // Respond with the fetched entries
    } catch (error) {
      // Log the error and respond with a 500 status code
      logger.error("Error fetching calendar entries:", error);
      res.status(500).json({ error: "Failed to fetch calendar entries" });
    }
  })
  // POST: Create a new calendar entry
  .post(async (req: Request, res: Response): Promise<void> => {
    // Destructure the data from the request body
    const { owner_id, recipe_id, date_saved, meal } = req.body;

    // Validate that required fields are present in the request body
    if (!owner_id || !date_saved || !meal) {
      res.status(400).json({ error: "owner_id, date_saved, and meal are required" });
      return; // Stop further execution if validation fails
    }

    try {
      // Create a new calendar entry using Prisma ORM
      const newEntry = await prisma.calendar.create({
        data: {
          owner_id,
          recipe_id,
          date_saved,
          meal,
        },
      });
      logger.info(`Created new calendar entry for owner_id: ${owner_id}`);
      res.status(201).json(newEntry); // Respond with the newly created entry
    } catch (error) {
      // Log the error and respond with a 500 status code
      logger.error("Error creating calendar entry:", error);
      res.status(500).json({ error: "Failed to create calendar entry" });
    }
  });

// Export the router for use in other parts of the application
export default router;
