import express, { Request, Response } from "express";
import multer from "multer";
import { prisma } from "../db/client";

const router = express.Router();

// Configure Multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Extend Request type to include 'file' property for TypeScript
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Handle POST request to /api/recipeImage for image upload
router.post("/", upload.single("image"), async (req: MulterRequest, res: Response): Promise<void> => {
  const file = req.file;
  const recipeId = req.body.recipe_id;

  // Check if recipe_id is provided
  if (!recipeId) {
    res.status(400).json({ error: "recipe_id is required" });
    return; // Ensure no further code runs
  }

  // Check if a file was uploaded
  if (!file) {
    res.status(400).json({ error: "No image uploaded" });
    return; // Ensure no further code runs
  }

  try {
    // Update the recipe with the uploaded image
    const updatedRecipe = await prisma.recipe.update({
      where: { recipe_id: recipeId },
      data: {
        image: file.buffer, // Save the image as binary data
      },
    });

    // Return the updated recipe with the new image
    res.status(201).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
