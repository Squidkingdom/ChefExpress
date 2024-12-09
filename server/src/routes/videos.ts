/**
 * Name: videos.ts
 * Description: This file defines routes for handling video-related requests. It includes logging for requests and provides functionality for adding and retrieving video records.
 * Programmer's name: Blake, Ike Brady
 * Date the code was created: 11/1/24
 * Date the code was revised: 11/1/24
 * Preconditions:
 *   - The client must send valid data to create a new video (for POST requests).
 * Acceptable input values or types:
 *   - POST request body: A valid video object (the structure depends on the database schema).
 * Postconditions:
 *   - A new video record is created when a POST request is made.
 *   - A list of videos is returned when the GET request is handled.
 * Return values or types:
 *   - On successful POST: Returns a status code of 200 with the created videos.
 *   - On failure: Returns a 500 error if something goes wrong while fetching videos.
 * Error and exception condition values:
 *   - On failure to fetch videos: Returns status 500 with the error message.
 * Side effects:
 *   - Logs the request to the `/api/videos/` endpoint each time it is accessed.
 * Invariants:
 *   - All video-related requests are handled by the appropriate route.
 * Known faults: None
 */

import express, { NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from "../db/client";


const router = express.Router();

// Create a logger for the file 'videos.ts'
const logger = log4js.getLogger('videos.ts');

// /api/videos/
router.route("/")
    .all((req: Request, res: Response, next: NextFunction) => {
        logger.info("Request to /api/videos/");
        console.log("Request to /api/videos/");
        next();
    }).post(async (req: Request, res: Response) => {
        // Fetch all videos from the database and send them as a response
        res.status(200).json(await prisma.videos.findMany());
    });

export default router;