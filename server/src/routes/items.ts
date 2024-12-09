/*
  This file defines the routes and logic for managing items in the catalog.
  The /api/items endpoint handles retrieving and updating item data from the database,
  including scraping product details such as price, title, and category from a URL.

  Programmer: Blake, Ike, Brady
  Date Created: 11/1/24
  Last Revised: 12/7/24
*/

// Import necessary modules
import express, { NextFunction, Request, Response } from "express"; // Express for routing
import log4js from "log4js"; // log4js for logging
import { prisma } from "../db/client"; // Prisma client for database interaction
import { chromium, Page } from "playwright"; // Playwright for browser automation

// Initialize express router and logger for item routes
const router = express.Router();
const logger = log4js.getLogger("items.ts");

// Define an interface for the CatalogItem object
interface CatalogItem {
    name: string | null;
    price: string;
    URL: string;
    quantity: string | null;
    category: string | null;
    id: number;
}

/*
  Function to examine an HTML element and return it.
  This is a placeholder function, currently not doing anything significant.
*/
function examine(item: SVGElement | HTMLElement): SVGElement | HTMLElement {
    const item2 = item;
    return item2; // Return the same item passed to the function
}

/*
  Function to fetch product details (price, title, category) from a given URL.
  It uses Playwright to open the page, extract data, and update the item in the database.
*/
async function getProductPrice(url: string, id: number): Promise<void> {
    const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'; // Custom user-agent to mimic a real browser
    const browser = await chromium.launch({ headless: true }); // Launch headless browser
    const page: Page = await browser.newPage(); // Create a new page in the browser
    
    try {
        await page.goto(url); // Go to the product page

        // Define selectors to look for product prices on the page
        const priceSelectors = [
            '.a-price .a-offscreen', // Amazon price selector 1
            '#priceblock_ourprice', // Amazon price selector 2
            '#priceblock_dealprice', // Amazon price selector 3
            '#priceblock_saleprice', // Amazon price selector 4
            '#corePriceDisplay_desktop_feature_div .a-offscreen' // Amazon price selector 5
        ];
        await page.waitForSelector('#landingImage'); // Wait for the product image to load

        // Extract product title and category
        const productTitle = await page.$eval("#productTitle", el => el.textContent?.trim()).catch(() => null);
        const category = await page.$eval("#wayfinding-breadcrumbs_container li", el => el.textContent?.trim() || "Unknown")
            .catch(() => "Unknown");

        let price = null;
        // Loop through price selectors to find the price
        for (const selector of priceSelectors) {
            price = await page.$eval(selector, el => el.textContent?.trim()).catch(() => null);
            if (price) break; // Stop once a price is found
        }

        // Get the product image URL
        const imageUrl = await page.$eval("#landingImage", el => el.getAttribute('src')).catch(() => null);
        console.log('Image: ' + imageUrl); // Log the image URL

        // If price and title are found, update the item in the database
        if (price && productTitle) {
            const updated = await prisma.items.update({
                where: { id: id },
                data: imageUrl ? { // Update item with image if available
                    price: price,
                    name: productTitle,
                    category: category,
                    quantity: "1",
                    img: imageUrl
                } : {
                    price: price,
                    name: productTitle,
                    category: category,
                    quantity: "1"
                }
            });
            console.log(`Updated item ${id}: ${price}, ${productTitle}, ${category}`); // Log the update
        }
    } catch (error: any) {
        console.error(`Failed to get product data for ${url} (id: ${id}): ${error.message}`); // Log any errors
    } finally {
        await browser.close(); // Ensure the browser is closed after scraping
    }
}

// Define the routes for the /api/items endpoint
router.route("/")
    // Middleware to log all requests to /api/items
    .all((req: Request, res: Response, next: NextFunction) => {
        logger.info("Request to /api/items/");
        console.log("Request to /api/items/");
        next(); // Pass control to the next middleware or route handler
    })
    // PURGE: Update product details for all items in the database by scraping product URLs
    .purge(async (req: Request, res: Response) => {
        const dbItems = await prisma.items.findMany().catch((error: any) => {
            res.status(500).json({ error: "Failed to fetch product data" }); // Handle fetch error
            return [];
        });

        // Process each item using a for...of loop to await each scraping promise
        for (const item of dbItems) {
            getProductPrice(item.URL, item.id); // Scrape the product details
        }
        res.status(200).json({ message: "Items updated" }); // Respond with success message
    })
    // GET: Retrieve all items from the database and return them in the response
    .get(async (req: Request, res: Response) => {
        try {
            const items = await prisma.items.findMany(); // Fetch items from the database
            res.status(200).json(items); // Respond with the items
        } catch (error: any) {
            logger.error(`Error fetching items: ${error.message}`); // Log any errors
            console.error(error);
            res.status(500).json({ error: "Failed to fetch product data" }); // Respond with error message
        }
    });

// Export the router for use in other parts of the application
export default router;