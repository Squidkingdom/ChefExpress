//Import express router
import express from 'express';
import items from './items';
import videos from './videos';
import recipe from './recipe';

const router = express.Router();

router.use('/items', items);
router.use('/videos', videos);
router.use('/recipe', recipe);

export default router;