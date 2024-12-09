/*
  This file defines the logic for handling user login via the /api/login route.
  The user must provide an email and a password hash, which are validated against the database.

  Programmer: Blake, Brady
  Date Created: 11/30/24
  Last Revised: 11/30/24
*/

// Import necessary modules
import express, { NextFunction, Request, Response } from "express";  // Express for routing
import log4js from "log4js";  // log4js for logging
import { prisma } from "../db/client";  // Prisma client for database interaction

// Initialize express router and logger for login routes
const router = express.Router();
const logger = log4js.getLogger("login.ts");

/*
  POST handler for user login.
  It accepts email and password hash in the request body, validates them against the database,
  and returns the user's UUID if the credentials are correct.
*/
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, pass_hash } = req.body;  // Extract email and password hash from the request body

  logger.info("Attempting login for email: " + email);  // Log the login attempt

  try {
    // Check if the email exists in the database by querying the 'users' table
    const user = await prisma.users.findFirst({
      where: { email: email },  // Search for a user with the provided email
    });

    if (!user) {
      // If no user is found, return a 400 error with an invalid email/password message
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // For testing purposes, compare the provided pass_hash with a static value (testhash123)
    if (user.pass_hash !== pass_hash) {
      // If the password hash doesn't match, return a 400 error with an invalid email/password message
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // If the credentials are correct, log the success and return the user's UUID and name
    logger.info("User logged in successfully with UUID: " + user.uuid);
    res.status(200).json({ uuid: user.uuid, name: user.name });

  } catch (error) {
    // Log any errors that occur during the process and respond with a 500 internal server error
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export the router for use in other parts of the application
export default router;