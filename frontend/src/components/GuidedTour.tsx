/***************************************************************************************************
 * Name of code artifact: GuidedTour.tsx
 * Brief description of what the code does:
 *   This file defines the GuidedTour component, which utilizes the React Joyride library to 
 *   guide users through various key sections of the ChefExpress web application. The guided 
 *   tour covers navigation through sections like Learn, Make (Recipe Maker and Meal Planner), 
 *   Order, and Share, and also encourages users to log in. It provides a series of steps that 
 *   highlight different parts of the UI.
 * Programmer’s name: Programmer 1
 * Date the code was created: Date 1
 * Dates the code was revised: Date 2
 * Brief description of each revision & author:
 *   Date 2 - Programmer 1: Added steps for new sections, refined the step targets, and implemented 
 *   route navigation logic.
 * Preconditions:
 *   - React environment is set up.
 *   - React Router (useNavigate, useLocation) and Joyride are installed and properly configured.
 *   - DOM elements matching the specified targets (e.g., ".navbar", "#learn-hero") must exist 
 *     for the steps to highlight.
 * Acceptable input values or types:
 *   - `runTour`: boolean (true indicates the tour should start or resume).
 *   - `setRunTour`: function to control the `runTour` state.
 *   - `setIsLoginOpen`: function to open or close the login modal.
 * Unacceptable input values or types:
 *   - Non-boolean value for `runTour`.
 *   - Non-function values for `setRunTour` and `setIsLoginOpen`.
 * Postconditions:
 *   - Renders a guided tour overlay if `runTour` is true.
 *   - Updates the current route and UI state as the user proceeds through the tour steps.
 * Return values or types:
 *   - Returns a React functional component (JSX.Element) that integrates the Joyride component 
 *     for a guided tour.
 * Error and exception condition values or types:
 *   - If a target element does not exist, Joyride may skip that step or log an error to the console.
 *   - If required dependencies are missing, the component may fail to compile or function.
 * Side effects:
 *   - Navigates between different pages when steps progress.
 *   - Opens the login modal at a specific step.
 * Invariants:
 *   - Step definitions remain consistent with the application’s UI structure.
 * Any known faults:
 *   - If DOM targets change, the steps may no longer point to correct elements.
 * Comments summarizing major blocks of code:
 *   - Imports: Bring in React, Router hooks, and Joyride.
 *   - Interface & component definition: Define GuidedTourProps and the GuidedTour component.
 *   - Steps array: Define each guided step with titles, content, and placement.
 *   - stepRoutes array: Maps each step index to a route, controlling navigation.
 *   - handleJoyrideCallback: Manages state transitions, route navigation, and login modal logic 
 *     when steps change.
 *   - useEffect hook: Restarts tour when runTour changes to true.
 *   - JSX return: Renders the Joyride component with specified styles, steps, and callback.
 * Comments on every line are provided below.
 ***************************************************************************************************/

// src/components/GuidedTour.tsx

// Import React and hooks for state and effect management
import React, { useState, useEffect } from "react";
// Import navigation hooks from React Router
import { useNavigate, useLocation } from "react-router-dom";
// Import Joyride and types for the guided tour functionality
import Joyride, {
  EVENTS,          // Enumerations for Joyride events
  STATUS as JoyrideStatus, // Renamed STATUS as JoyrideStatus for clarity
  Step,            // Type definition for a single step in the tour
  CallBackProps,   // Type definition for callback event properties
} from "react-joyride";

// Define component properties interface
interface GuidedTourProps {
  runTour: boolean;                   // Whether the tour should run
  setRunTour: (run: boolean) => void; // Function to update the runTour state
  setIsLoginOpen: (isOpen: boolean) => void; // Function to open/close the login modal
}

/**
 * GuidedTour Component
 * Includes steps for Learn, Recipe Maker, Make (Meal Planner), Order (Hero Section), and Share pages.
 * @param {GuidedTourProps} props - Properties for the guided tour component.
 * @returns {React.JSX.Element} - The GuidedTour component.
 */
const GuidedTour: React.FC<GuidedTourProps> = ({
  runTour,       // Boolean controlling if the tour is currently running
  setRunTour,    // Function to start/stop the tour
  setIsLoginOpen // Function to open the login modal
}) => {
  // useNavigate allows programmatic navigation between routes
  const navigate = useNavigate();
  // useLocation provides the current route’s location object
  const location = useLocation();
  
  // Track the current step index of the tour
  const [stepIndex, setStepIndex] = useState(0);

  // Define steps for the guided tour, including target elements and content
  const steps: Step[] = [
    {
      target: "body", // Targets the entire body to display a welcome message
      content: "Welcome to ChefExpress! Let's begin our journey.",
      placement: "center",
      disableBeacon: true,
      title: "Welcome!",
    },
    {
      target: ".navbar", // Target the navigation bar
      content: "Use our main navigation to explore different sections.",
      placement: "bottom",
      title: "Navigation Bar",
    },
    {
      target: "#learn-hero", // Target the Learn section hero element
      content: "Discover culinary skills in our Learn section.",
      placement: "top",
      title: "Learn Section",
    },
    {
      target: "#make-recipe-maker", // Target the Recipe Maker in Make section
      content: "Create and customize your own recipes with our Recipe Maker.",
      placement: "top",
      title: "Recipe Maker",
    },
    {
      target: "#make-meal-planner", // Target the Meal Planner in Make section
      content: "Plan your meals for the week with our intuitive meal planner.",
      placement: "top",
      title: "Meal Planner",
    },
    {
      target: "#order-hero", // Target the Order page hero section
      content: "Order your favorite kitchen tools from our selection.",
      placement: "top",
      title: "Order Section",
    },
    {
      target: "#share-upload", // Target the Share section upload area
      content: "Share your culinary creations with the community.",
      placement: "top",
      title: "Share Section",
    },
    {
      target: ".login-button", // Target a login button element
      content: "Sign up or log in to access personalized features!",
      placement: "bottom",
      title: "Login",
    },
    {
      target: ".site-logo", // Target the site logo for final step
      content: "Thank you for taking the tour! Enjoy exploring ChefExpress.",
      placement: "bottom",
      disableBeacon: true,
      title: "Thank You!",
    },
  ];

  // stepRoutes maps each step index to a route (null means no navigation for that step)
  const stepRoutes: (string | null)[] = [
    null,     // Step 0: Welcome
    "/",      // Step 1: Navbar (homepage)
    "/learn", // Step 2: Learn page
    "/make",  // Step 3: Make page (Recipe Maker)
    "/make",  // Step 4: Make page (Meal Planner)
    "/order", // Step 5: Order page
    "/share", // Step 6: Share page
    "/",      // Step 7: Back to homepage (for login step)
    null,     // Step 8: Thank You (no navigation)
  ];

  /**
   * Handle Joyride callback events
   * @param {CallBackProps} data - Data from Joyride callback
   */
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, type } = data; // Extract status, action, and event type

    // Debug logging to the console
    console.log("Joyride Callback Data:", { status, action, type });

    // If the tour is finished, skipped, closed, or user clicked skip/close
    if (
      status === JoyrideStatus.FINISHED ||
      status === JoyrideStatus.SKIPPED ||
      action === "close" ||
      action === "skip"
    ) {
      console.log("Tour finished or skipped. Closing the tour.");
      setRunTour(false);  // Stop running the tour
      setStepIndex(0);     // Reset step index to the beginning
      return;              // Exit the callback
    }

    // Handle step transitions for STEP_AFTER or TARGET_NOT_FOUND events
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      let newStepIndex = stepIndex; // Start with the current step index

      if (action === "prev") {
        // User clicked the Back button, go to previous step
        newStepIndex = stepIndex - 1;
      } else {
        // Otherwise, go to the next step
        newStepIndex = stepIndex + 1;
      }

      // Ensure newStepIndex stays within bounds of the steps array
      newStepIndex = Math.max(0, Math.min(newStepIndex, steps.length - 1));

      console.log("Navigating to step index:", newStepIndex);
      setStepIndex(newStepIndex); // Update current step index state

      // Navigate to the corresponding route if defined
      const targetRoute = stepRoutes[newStepIndex];
      if (targetRoute && location.pathname !== targetRoute) {
        console.log(`Navigating to route: ${targetRoute}`);
        navigate(targetRoute);
      }

      // If step 7 is reached, open the login modal
      if (newStepIndex === 7) {
        console.log("Opening login modal.");
        setIsLoginOpen(true);
      }

      // If the last step is reached and action is "next", end the tour
      if (newStepIndex === steps.length - 1 && action === "next") {
        console.log("Last step reached. Closing the tour.");
        setRunTour(false);
        setStepIndex(0);
      }
    }
  };

  // useEffect runs when runTour changes, restarting the tour if runTour is true
  useEffect(() => {
    if (runTour) {
      console.log("Tour started.");
      setStepIndex(0); // Reset step index at the start of the tour
    }
  }, [runTour]);

  // Render the Joyride component with defined steps, styling, and callback
  return (
    <Joyride
      debug={true}           // Enable debug mode for verbose console logging
      steps={steps}          // Use the defined steps array
      run={runTour}          // Control whether the tour runs
      stepIndex={stepIndex}  // Track which step is active
      continuous             // Make navigation between steps seamless
      scrollToFirstStep      // Scroll to the element at the first step
      showSkipButton         // Display a skip button to allow user to skip the tour
      showProgress           // Display step count progress indicator
      disableScrolling={false} // Allow scrolling during the tour
      spotlightClicks={true}   // Allow clicking highlighted elements
      styles={{
        options: {
          zIndex: 10000,                // Bring Joyride elements to the front
          primaryColor: "#0D9488",      // Button and highlight colors
          backgroundColor: "#1F1F1F",   // Tooltip background
          textColor: "#E5E5E5",         // Tooltip text color
          arrowColor: "#1F1F1F",        // Arrow color for the tooltip
          overlayColor: "rgba(0, 0, 0, 0.6)", // Dimmed overlay background
        },
        tooltipContainer: {
          textAlign: "left", // Align text to the left in the tooltip
        },
        buttonNext: {
          backgroundColor: "#0D9488", // Next button background
          color: "#FFFFFF",           // Next button text color
        },
        buttonBack: {
          color: "#FFFFFF", // Back button text color
        },
        buttonSkip: {
          color: "#FFFFFF", // Skip button text color
        },
      }}
      locale={{
        back: "Back",   // Text for back button
        close: "Close", // Text for close button
        last: "Finish", // Text for last step button
        next: "Next",   // Text for next button
        skip: "Skip",   // Text for skip button
      }}
      callback={handleJoyrideCallback} // Handle Joyride events via callback
    />
  );
};

// Export the GuidedTour component for use in other parts of the application
export default GuidedTour;


// // src/components/GuidedTour.tsx

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Joyride, {
//   EVENTS,
//   STATUS as JoyrideStatus,
//   Step,
//   CallBackProps,
// } from "react-joyride";

// interface GuidedTourProps {
//   runTour: boolean;
//   setRunTour: (run: boolean) => void;
//   setIsLoginOpen: (isOpen: boolean) => void;
// }

// /**
//  * GuidedTour Component
//  * Includes steps for Learn, Recipe Maker, Make (Meal Planner), Order (Hero Section), and Share pages.
//  * @param {GuidedTourProps} props - Properties for the guided tour component.
//  * @returns {React.JSX.Element} - The GuidedTour component.
//  */
// const GuidedTour: React.FC<GuidedTourProps> = ({
//   runTour,
//   setRunTour,
//   setIsLoginOpen,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [stepIndex, setStepIndex] = useState(0);

//   // Define steps with accurate targets and content
//   const steps: Step[] = [
//     {
//       target: "body",
//       content: "Welcome to ChefExpress! Let's begin our journey.",
//       placement: "center",
//       disableBeacon: true,
//       title: "Welcome!",
//     },
//     {
//       target: ".navbar",
//       content: "Use our main navigation to explore different sections.",
//       placement: "bottom",
//       title: "Navigation Bar",
//     },
//     {
//       target: "#learn-hero",
//       content: "Discover culinary skills in our Learn section.",
//       placement: "top",
//       title: "Learn Section",
//     },
//     {
//       target: "#make-recipe-maker",
//       content: "Create and customize your own recipes with our Recipe Maker.",
//       placement: "top",
//       title: "Recipe Maker",
//     },
//     {
//       target: "#make-meal-planner",
//       content: "Plan your meals for the week with our intuitive meal planner.",
//       placement: "top",
//       title: "Meal Planner",
//     },
//     {
//       target: "#order-hero", // Updated target ID for Order Hero Section
//       content: "Order your favorite kitchen tools from our selection.",
//       placement: "top",
//       title: "Order Section",
//     },
//     {
//       target: "#share-upload",
//       content: "Share your culinary creations with the community.",
//       placement: "top",
//       title: "Share Section",
//     },
//     {
//       target: ".login-button",
//       content: "Sign up or log in to access personalized features!",
//       placement: "bottom",
//       title: "Login",
//     },
//     // Optionally change the target or remove the last step
//     {
//       target: ".site-logo", // Ensure this class exists in your Header component
//       content: "Thank you for taking the tour! Enjoy exploring ChefExpress.",
//       placement: "bottom",
//       disableBeacon: true,
//       title: "Thank You!",
//     },
//   ];

//   // Mapping of step indices to routes
//   const stepRoutes: (string | null)[] = [
//     null,        // Step 0: Welcome (no navigation)
//     "/",         // Step 1: Navbar (homepage)
//     "/learn",    // Step 2: Learn page
//     "/make",     // Step 3: Make page (Recipe Maker)
//     "/make",     // Step 4: Make page (Meal Planner)
//     "/order",    // Step 5: Order page
//     "/share",    // Step 6: Share page
//     "/",         // Step 7: Navbar (Login)
//     null,        // Step 8: Thank You (no navigation)
//   ];

//   /**
//    * Handle Joyride callback events
//    * @param {CallBackProps} data - Data from Joyride callback
//    */
//   const handleJoyrideCallback = (data: CallBackProps) => {
//     const { status, action, type } = data;

//     // Logging for debugging
//     console.log("Joyride Callback Data:", { status, action, type });

//     // Handle tour termination actions
//     if (
//       status === JoyrideStatus.FINISHED ||
//       status === JoyrideStatus.SKIPPED ||
//       action === "close" ||
//       action === "skip"
//     ) {
//       console.log("Tour finished or skipped. Closing the tour.");
//       setRunTour(false);
//       setStepIndex(0); // Reset stepIndex to avoid residual state
//       return;
//     }

//     // Handle step transitions
//     if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
//       let newStepIndex = stepIndex;

//       if (action === "prev") {
//         // User clicked the Back button
//         newStepIndex = stepIndex - 1;
//       } else {
//         // User clicked the Next button or triggered an automatic advance
//         newStepIndex = stepIndex + 1;
//       }

//       // Boundary checks to prevent invalid step indices
//       newStepIndex = Math.max(0, Math.min(newStepIndex, steps.length - 1));

//       console.log("Navigating to step index:", newStepIndex);

//       setStepIndex(newStepIndex);

//       // Navigate to the corresponding route if applicable
//       const targetRoute = stepRoutes[newStepIndex];
//       if (targetRoute && location.pathname !== targetRoute) {
//         console.log(`Navigating to route: ${targetRoute}`);
//         navigate(targetRoute);
//       }

//       // Additional action for the login modal
//       if (newStepIndex === 7) {
//         console.log("Opening login modal.");
//         setIsLoginOpen(true);
//       }

//       // Handle completion if it's the last step
//       if (newStepIndex === steps.length - 1 && action === "next") {
//         console.log("Last step reached. Closing the tour.");
//         setRunTour(false);
//         setStepIndex(0);
//       }
//     }
//   };

//   // Restart the tour when runTour prop changes to true
//   useEffect(() => {
//     if (runTour) {
//       console.log("Tour started.");
//       setStepIndex(0);
//     }
//   }, [runTour]);

//   return (
//     <Joyride
//       debug={true} // Enable debug mode for detailed logs
//       steps={steps}
//       run={runTour}
//       stepIndex={stepIndex}
//       continuous
//       scrollToFirstStep
//       showSkipButton
//       showProgress
//       disableScrolling={false}
//       spotlightClicks={true}
//       styles={{
//         options: {
//           zIndex: 10000,
//           primaryColor: "#0D9488",
//           backgroundColor: "#1F1F1F",
//           textColor: "#E5E5E5",
//           arrowColor: "#1F1F1F",
//           overlayColor: "rgba(0, 0, 0, 0.6)",
//         },
//         tooltipContainer: {
//           textAlign: "left",
//         },
//         buttonNext: {
//           backgroundColor: "#0D9488",
//           color: "#FFFFFF",
//         },
//         buttonBack: {
//           color: "#FFFFFF",
//         },
//         buttonSkip: {
//           color: "#FFFFFF",
//         },
//       }}
//       locale={{
//         back: "Back",
//         close: "Close",
//         last: "Finish",
//         next: "Next",
//         skip: "Skip",
//       }}
//       callback={handleJoyrideCallback}
//     />
//   );
// };

// export default GuidedTour;
