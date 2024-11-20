import express, {NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from '../db/client';


const router = express.Router();

//Create a logger for the file 'items.ts'
const logger = log4js.getLogger('items.ts');

// /api/items/
router.route("/")
    .all((req: Request, res: Response, next: NextFunction) => {
        logger.info("Request to /api/items/");
        console.log("Request to /api/items/");
        next();
    }).post(async (req: Request, res: Response) => {
        // prisma.items.findMany().then((items) => {
        //     res.status(200).json(items);
        // }).catch((error) => {
        //     res.status(500).json({error: error.message});
        // });

        res.status(200).json(await prisma.items.findMany());

    })
    




export default router;