/***************************************************************************************************
 * Name of code artifact: index.ts
 * Brief description of what the code does:
 *   This file defines TypeScript interfaces for product and cart item data structures used in the 
 *   application. It ensures consistent typing throughout the codebase wherever product or cart 
 *   item information is handled.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added optional fields for rating, reviews, and description to the Product 
 *   interface to support enhanced product details.
 * Preconditions:
 *   - Used in a TypeScript environment.
 *   - Other parts of the application assume these interfaces accurately represent the data shape.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - `id`: number, a unique product identifier.
 *   - `name`: string, the product's name.
 *   - `price`: string, formatted price with a leading '$' (e.g. "$19.99").
 *   - `URL`: string, a link to the product page on an external site (e.g., Amazon).
 *   - `quantity` (in Product): string, representing how many items are available. In the Product 
 *     interface, it's stored as a string (could represent "N/A" or other textual data).
 *   - `category`: string, the product category.
 *   - `img`: string, the URL of the product image.
 *   - `rating` and `reviews`: optional numeric fields for product evaluation.
 *   - `description`: optional string providing additional product details.
 *   - In CartItem, `quantity` becomes a number to represent how many units of the product are 
 *     added to the cart.
 * Postconditions:
 *   - Provides strongly typed structures for products and cart items.
 * Return values or types:
 *   - `Product`: Interface describing product properties.
 *   - `CartItem`: Interface describing cart item properties, based on `Product` but with a numeric quantity.
 * Error and exception condition values or types:
 *   - None are explicitly handled here; these are type definitions only.
 * Side effects:
 *   - None, as these are just type definitions.
 * Invariants:
 *   - The `CartItem` interface always includes a numeric `quantity` instead of a string.
 * Any known faults:
 *   - None known. Assumes all data will adhere to the defined properties.
 * Comments summarizing major blocks of code:
 *   - `Product` interface: Defines the structure of product data.
 *   - `CartItem` interface: Extends `Product` but replaces `quantity` with a numeric field 
 *     to represent cart-specific state.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Interface representing a product with various properties.
export interface Product {
  id: number;               // Unique identifier for the product
  name: string;             // Product name
  price: string;            // Price as a string (e.g., "$19.99")
  URL: string;              // Link to the product on an external site (e.g. Amazon)
  quantity: string;         // Available quantity as a string (could be "N/A" or a numeric string)
  category: string;         // Product category (e.g., "Utensils", "Cookware")
  img: string;              // Image URL for the product
  rating?: number;          // Optional rating (e.g., from 1 to 5)
  reviews?: number;         // Optional number of reviews
  description?: string;     // Optional detailed product description
}

// CartItem interface extends Product but changes quantity from a string to a number.
// Omit 'quantity' from Product, then add a numeric quantity field for cart usage.
export interface CartItem extends Omit<Product, 'quantity'> {
  quantity: number;         // Numeric quantity representing how many of the product are in the cart
}


// export interface Product {
//   id: number;
//   name: string;
//   price: string;
//   URL: string;
//   quantity: string;
//   category: string;
//   img: string;
//   rating?: number;
//   reviews?: number;
//   description?: string;
// }

// // Omit the quantity from Product and add it as a number for CartItem
// export interface CartItem extends Omit<Product, 'quantity'> {
//   quantity: number;
// }