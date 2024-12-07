//Import express router
import express from 'express';
import items from './items';
import videos from './videos';
import recipe from './recipe';
import recipeImage from './recipeImage';
import register from './register';
import login from './login';
import saveRecipe from './saveRecipe';

const router = express.Router();

router.use('/items', items);
router.use('/videos', videos);
router.use('/recipe', recipe);
// router.use('/recipeImage', recipeImage);
router.use('/register', register);
router.use('/login', login);
router.use('/saveRecipe', saveRecipe);

export default router;