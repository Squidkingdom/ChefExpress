/***************************************************************************************************
 * Name of code artifact: index.tsx
 * Brief description of what the code does:
 *   This file defines an Order component that wraps the OrderPage component within an ErrorBoundary 
 *   to catch and display any runtime errors in a user-friendly manner. If an error occurs, it shows 
 *   a styled error message and provides a button to refresh the page.
 * Programmer’s name: Brady
 * Date the code was created: 11/20/24
 * Dates the code was revised: 11/24/24
 * Brief description of each revision & author:
 *   OrderPage component and improved error logging.
 * Preconditions:
 *   - React environment set up.
 *   - OrderPage component must be defined and properly imported.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - No input values; this component relies on OrderPage and only catches runtime errors.
 * Unacceptable input values or types:
 *   - None, as this is a top-level component without direct inputs.
 * Postconditions:
 *   - If an error is thrown in OrderPage or its children, the ErrorBoundary will display an 
 *     error message and a refresh button.
 * Return values or types:
 *   - Returns a React Functional Component (JSX.Element).
 * Error and exception condition values or types:
 *   - Any unhandled errors in OrderPage or its descendants trigger the ErrorBoundary’s fallback UI.
 * Side effects:
 *   - Logs errors to the console for debugging.
 * Invariants:
 *   - The fallback UI is displayed only when an error occurs.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - ErrorBoundary class: Catches errors in its children and shows a fallback UI.
 *   - Order component: Wraps the OrderPage in React.StrictMode and ErrorBoundary.
 * Comments on every line are provided below.
 ***************************************************************************************************/

export interface Product {
  id: number;
  name: string;
  price: string;
  URL: string;
  quantity: string;
  category: string;
  img: string;
  rating?: number;
  reviews?: number;
  description?: string;
}

// Omit the quantity from Product and add it as a number for CartItem
export interface CartItem extends Omit<Product, 'quantity'> {
  quantity: number;
}