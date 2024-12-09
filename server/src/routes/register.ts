/**
 * Name: register.ts
 * Description: This file handles the user registration process, including checking if an email is already registered and creating a new user.
 * Programmer's name: Blake, Brady
 * Date the code was created: 11/30/24
 * Date the code was revised: 12/7/24
 * Preconditions: The client must send a valid email, name, and password hash for the registration request.
 * Acceptable input values or types:
 *   - `email` (string): The email of the user (must be a valid email format).
 *   - `name` (string): The name of the user.
 *   - `pass_hash` (string): The hashed password for the user.
 * Postconditions: A new user is created in the database if the email is not already taken.
 * Return values or types:
 *   - On successful registration: Returns a JSON object containing the UUID and name of the new user.
 *   - On failure (email already registered or other errors): Returns an error message and status code.
 * Error and exception condition values:
 *   - Email already registered: Returns status 400 with the message "Email is already registered".
 *   - Server errors during user creation: Returns status 500 with the message "Internal server error".
 * Side effects: A new user is added to the database.
 * Invariants: Each user has a unique UUID, and the email must be unique.
 * Known faults: None
 */

import express, { NextFunction, Request, Response } from "express"; 
import log4js from "log4js"; 
import { prisma } from "../db/client";  
import { v4 as uuidv4 } from "uuid";  

const router = express.Router();  

// Create a logger for this file
const logger = log4js.getLogger("register.ts");

// Handle POST request to /api/register for user registration
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Extract the email, name, and password hash from the request body
  const { email, name, pass_hash } = req.body;  

  // Log the attempt to register with the provided email
  logger.info("Attempting to register a new user with email: " + email);

  try {
    // Check if the email is already taken by querying the database
    const existingUser = await prisma.users.findFirst({
      where: { email: email },
    });

    // If the email is already registered, return a 400 error
    if (existingUser) {
      res.status(400).json({ error: "Email is already registered" });
      return;
    }

    // If email is not registered, create a new user with a UUID and password hash
    const newUser = await prisma.users.create({
      data: {
        email: email,
        name: name,
        pass_hash: pass_hash,
        uuid: uuidv4(), // Generate a unique UUID for the new user
      },
    });

    // Log the successful creation of the new user
    logger.info("Successfully created a new user with UUID: " + newUser.uuid);

    // Respond with the UUID and name of the new user
    res.status(201).json({ uuid: newUser.uuid, name: newUser.name });
  } catch (error) {
    // Log and return an error if the registration fails
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
