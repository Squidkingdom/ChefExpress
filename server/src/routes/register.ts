import express, { NextFunction, Request, Response } from "express"; 
import log4js from "log4js"; 
import { prisma } from "../db/client";  
import { v4 as uuidv4 } from "uuid";  

const router = express.Router();  

// Create a logger for this file
const logger = log4js.getLogger("register.ts");

// Handle POST request to /api/register for user registration
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, name, pass_hash } = req.body;  

  logger.info("Attempting to register a new user with email: " + email);

  try {
    // Check if the email is already taken
    const existingUser = await prisma.users.findFirst({
      where: { email: email },
    });

    if (existingUser) {
      // If email already registered, return a 400 error
      res.status(400).json({ error: "Email is already registered" });
      return;
    }

    // Create a new user with UUID and pass_hash
    const newUser = await prisma.users.create({
      data: {
        email: email,
        name: name,
        pass_hash: pass_hash,
        uuid: uuidv4(),
      },
    });

    logger.info("Successfully created a new user with UUID: " + newUser.uuid);

    // Return the UUID of the new user
    res.status(201).json({ uuid: newUser.uuid, name: newUser.name });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
