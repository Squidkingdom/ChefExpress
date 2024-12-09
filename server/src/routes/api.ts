/*
  API route handling for the Chef Express application.
  This file is responsible for defining and registering all the API routes 
  by using Express Router and mapping them to their respective route handlers.

  Programmer: Brady
  Date Created: 11/1/24
  Last Revised: 12/8/24
*/

// Import the express module to work with the router
import express from 'express'; // Express framework for routing
import items from './items'; // Import the 'items' route handler
import videos from './videos'; // Import the 'videos' route handler
import recipe from './recipe'; // Import the 'recipe' route handler
import register from './register'; // Import the 'register' route handler
import login from './login'; // Import the 'login' route handler
import saveRecipe from './saveRecipe'; // Import the 'saveRecipe' route handler
import calendar from './calendar'; // Import the 'calendar' route handler

// Create an instance of the express router
const router = express.Router();

// Use route handlers for different API endpoints
router.use('/items', items); // Route for managing items
router.use('/videos', videos); // Route for managing videos
router.use('/recipe', recipe); // Route for managing recipes
router.use('/register', register); // Route for handling user registration
router.use('/login', login); // Route for handling user login
router.use('/saveRecipe', saveRecipe); // Route for saving recipes
router.use('/calendar', calendar); // Route for managing meal planning (calendar)

// Export the router to be used in other parts of the application
export default router;
