import express, { NextFunction, Request, Response } from "express";
import log4js from "log4js";
import { prisma } from "../db/client";
import { chromium, Page } from "playwright";

const router = express.Router();
const logger = log4js.getLogger("items.ts");

interface CatalogItem {
    name: string | null;
    price: string;
    URL: string;
    quantity: string | null;
    category: string | null;
    id: number;
}

function examine(item: SVGElement | HTMLElement): SVGElement | HTMLElement {
    const item2 = item;
    return item2;

}

async function getProductPrice(url: string, id: number): Promise<void> {
    // Launch a headless browser
    const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
    const browser = await chromium.launch({ headless: true });
    const page: Page = await browser.newPage();
    
    try {
        // Navigate to the product page
        const urlWithNoCache = `${url}`;
        await page.goto(urlWithNoCache);
        

        // Extract price, product title, and category.
        const priceSelectors = [
            '.a-price .a-offscreen',
            '#priceblock_ourprice',
            '#priceblock_dealprice',
            '#priceblock_saleprice',
            '#corePriceDisplay_desktop_feature_div .a-offscreen'
        ];
        // await page.emulateMedia({ media: 'screen' });
        // let test = (await page.pdf({ path: 'page.pdf' }));
        // //write to file
        // const fs = require('fs');
        // fs.writeFileSync('page.pdf', test);
        await page.waitForSelector('#landingImage');


        const productTitle = await page.$eval("#productTitle", el => el.textContent?.trim()).catch(() => null);
        const category = await page.$eval("#wayfinding-breadcrumbs_container li", el => el.textContent?.trim() || "Unknown")
            .catch(() => "Unknown");
        let price = null;

    
        for (const selector of priceSelectors) {
            price = await page.$eval(selector, el => el.textContent?.trim()).catch(() => null);
            if (price) break;
        }

        // get image url
        const imageUrl = await page.$eval("#landingImage", el => el.getAttribute('src')).catch(() => null);
        console.log('Image: ' + imageUrl);

        if (price && productTitle) {
            const updated = await prisma.items.update({
                where: { id: id },
                data: imageUrl ? {
                    price: price,
                    name: productTitle,
                    category: category,
                    quantity: "1",
                    img: imageUrl
            } :{
                price: price,
                name: productTitle,
                category: category,
                quantity: "1"
        }
                });
            console.log(`Updated item ${id}: ${price}, ${productTitle}, ${category}`);
        }
    } catch (error: any) {
        console.error(`Failed to get product data for ${url} (id: ${id}): ${error.message}`);
    } finally {
        await browser.close();
        
    }
}

router.route("/")
    .all((req: Request, res: Response, next: NextFunction) => {
        logger.info("Request to /api/items/");
        console.log("Request to /api/items/");
        next();
    })
    .purge(async (req: Request, res: Response) => {
            const dbItems = await prisma.items.findMany().catch((error: any) => {
                res.status(500).json({ error: "Failed to fetch product data" }); 
                return [];
            });

            // Process each item. Using a for...of loop ensures we await each promise.
            for (const item of dbItems) {
                getProductPrice(item.URL, item.id);
            }
            res.status(200).json({ message: "Items updated" });
    })
    .get(async (req: Request, res: Response) => {
        try {
            // Fetch items from DB
            const items = await prisma.items.findMany();
            res.status(200).json(items);
        } catch (error: any) {
            logger.error(`Error fetching items: ${error.message}`);
            console.error(error);
            res.status(500).json({ error: "Failed to fetch product data" });
        }
    });

export default router;
