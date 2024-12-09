/**
 * Name: main.tsx
 * Description:  
 * This file serves as the entry point for the Chef Express application. It initializes 
 * the React application, sets up React Query for state management, and renders the 
 * `App` component within a strict mode and the query client provider for managing 
 * server state.
 * 
 * Programmer's name: Brady, Darshil
 * Date the code was created: 11/1/24
 * Date the code was revised: 11/20/24
 * 
 * Preconditions:
 *   - React must be installed and correctly set up for the application to run.
 *   - Tailwind CSS and `QueryClient` dependencies (via React Query) must be properly installed.
 * 
 * Acceptable input values or types:
 *   - React components are expected to be passed as children to `QueryClientProvider`.
 * 
 * Postconditions:
 *   - The app will be rendered on the DOM with React Query integrated for managing server data.
 * 
 * Return values or types:
 *   - `createRoot().render()` returns a rendered JSX element that is inserted into the DOM.
 * 
 * Error and exception condition values:
 *   - The application will not render if the DOM element with id `root` is not found.
 * 
 * Side effects:
 *   - The app will be rendered inside the `root` element on the HTML page.
 * 
 * Invariants:
 *   - The `App` component is always wrapped in `StrictMode` and `QueryClientProvider`.
 * 
 * Known faults:
 *   - No known faults identified at this time.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css' // Importing the global styles from index.css
import App from './App.tsx'

// Create an instance of the QueryClient for managing server state
const queryClient = new QueryClient()

// Render the app, wrapping it with StrictMode and QueryClientProvider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* QueryClientProvider wraps the entire app to provide React Query's functionality */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)