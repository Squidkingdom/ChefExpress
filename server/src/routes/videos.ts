import express, {NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from '../db/client';


const router = express.Router();

//Create a logger for the file 'videos.ts'
const logger = log4js.getLogger('videos.ts');

// /api/videos/
router.route("/")
    .all((req: Request, res: Response, next: NextFunction) => {
        logger.info("Request to /api/videos/");
        console.log("Request to /api/videos/");
        next();
    }).post(async (req: Request, res: Response) => {
        // prisma.items.findMany().then((videos) => {
        //     res.status(200).json(videos);
        // }).catch((error) => {
        //     res.status(500).json({error: error.message});
        // });

        res.status(200).json(await prisma.videos.findMany());

    })
    




export default router;