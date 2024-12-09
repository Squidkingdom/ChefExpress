/***************************************************************************************************
 * Name of code artifact: ScrollToTop.tsx
 * Brief description of what the code does:
 *   This component listens for route changes using React Router's `useLocation` hook and, upon 
 *   detecting a new pathname, automatically scrolls the browser window back up to the top. This 
 *   ensures that each new page/view starts at the top of the viewport.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added route-based scrolling behavior and integrated useLocation hook.
 * Preconditions:
 *   - Must be used within a React Router environment so `useLocation` can track route changes.
 * Acceptable and unacceptable input values or types, and their meanings:
 *   - No props are required or accepted.
 *   - This component must be rendered within a Router context so `useLocation` can function.
 * Postconditions:
 *   - When the route changes (pathname updates), the window scrolls to position (0,0).
 * Return values or types:
 *   - Returns null, as it does not render any UI elements. It only performs a side effect.
 * Error and exception condition values or types:
 *   - None known; if window.scrollTo is not available, it may fail silently.
 * Side effects:
 *   - Manipulates the global window scroll position on pathname changes.
 * Invariants:
 *   - Every route change triggers a scroll to the top.
 * Any known faults:
 *   - None currently known.
 * Comments summarizing major blocks of code:
 *   - Hook usage: useLocation to detect when the pathname changes.
 *   - useEffect to trigger window scrolling whenever pathname updates.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// Import useEffect to handle side effects and useLocation to detect route changes
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component:
 * Ensures the window scrolls to the top (0,0) every time the route/pathname changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation(); // Extract current route pathname

  useEffect(() => {
    // On pathname change, scroll to the top of the window
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run effect when pathname changes

  return null; // No UI, just a side effect
};

export default ScrollToTop;


// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// /**
//  * ScrollToTop component to ensure the window scrolls to the top on route change.
//  */
// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// };

// export default ScrollToTop;
