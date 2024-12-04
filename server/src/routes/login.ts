import express, { NextFunction, Request, Response } from "express"; 
import log4js from "log4js"; 
import { prisma } from "../db/client";  

const router = express.Router();  

// Create a logger for this file
const logger = log4js.getLogger("login.ts");

// Handle POST request to /api/login for user login
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, pass_hash } = req.body;  // Extract email and password hash from the request body

  logger.info("Attempting login for email: " + email);

  try {
    // Check if the email exists in the database
    const user = await prisma.users.findFirst({
      where: { email: email },
    });

    if (!user) {
      // If user not found, return a 400 error
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // For testing purposes, you are comparing the provided pass_hash with a static value (testhash123)
    if (user.pass_hash !== pass_hash) {
      // If password doesn't match, return a 400 error
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    // If the credentials are correct, return the user's UUID
    logger.info("User logged in successfully with UUID: " + user.uuid);
    res.status(200).json({ uuid: user.uuid, name: user.name });

  } catch (error) {
    // Log any errors and return a 500 internal server error
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
