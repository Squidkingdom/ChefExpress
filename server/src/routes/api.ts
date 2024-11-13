//Import express router
import express from 'express';
import items from './items';
import videos from './videos';

const router = express.Router();

router.use('/items', items);
router.use('/videos', videos);

export default router;