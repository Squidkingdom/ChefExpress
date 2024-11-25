// src/components/GuidedTour.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Joyride, {
  EVENTS,
  STATUS as JoyrideStatus,
  Step,
  CallBackProps,
} from "react-joyride";

interface GuidedTourProps {
  runTour: boolean;
  setRunTour: (run: boolean) => void;
  setIsLoginOpen: (isOpen: boolean) => void;
}

/**
 * GuidedTour Component
 * Includes steps for Learn, Recipe Maker, Make (Meal Planner), Order (Hero Section), and Share pages.
 * @param {GuidedTourProps} props - Properties for the guided tour component.
 * @returns {React.JSX.Element} - The GuidedTour component.
 */
const GuidedTour: React.FC<GuidedTourProps> = ({
  runTour,
  setRunTour,
  setIsLoginOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);

  // Define steps with accurate targets and content
  const steps: Step[] = [
    {
      target: "body",
      content: "Welcome to ChefExpress! Let's begin our journey.",
      placement: "center",
      disableBeacon: true,
      title: "Welcome!",
    },
    {
      target: ".navbar",
      content: "Use our main navigation to explore different sections.",
      placement: "bottom",
      title: "Navigation Bar",
    },
    {
      target: "#learn-hero",
      content: "Discover culinary skills in our Learn section.",
      placement: "top",
      title: "Learn Section",
    },
    {
      target: "#make-recipe-maker",
      content: "Create and customize your own recipes with our Recipe Maker.",
      placement: "top",
      title: "Recipe Maker",
    },
    {
      target: "#make-meal-planner",
      content: "Plan your meals for the week with our intuitive meal planner.",
      placement: "top",
      title: "Meal Planner",
    },
    {
      target: "#order-hero", // Updated target ID for Order Hero Section
      content: "Order your favorite kitchen tools from our selection.",
      placement: "top",
      title: "Order Section",
    },
    {
      target: "#share-upload",
      content: "Share your culinary creations with the community.",
      placement: "top",
      title: "Share Section",
    },
    {
      target: ".login-button",
      content: "Sign up or log in to access personalized features!",
      placement: "bottom",
      title: "Login",
    },
    // Optionally change the target or remove the last step
    {
      target: ".site-logo", // Ensure this class exists in your Header component
      content: "Thank you for taking the tour! Enjoy exploring ChefExpress.",
      placement: "bottom",
      disableBeacon: true,
      title: "Thank You!",
    },
  ];

  // Mapping of step indices to routes
  const stepRoutes: (string | null)[] = [
    null,        // Step 0: Welcome (no navigation)
    "/",         // Step 1: Navbar (homepage)
    "/learn",    // Step 2: Learn page
    "/make",     // Step 3: Make page (Recipe Maker)
    "/make",     // Step 4: Make page (Meal Planner)
    "/order",    // Step 5: Order page
    "/share",    // Step 6: Share page
    "/",         // Step 7: Navbar (Login)
    null,        // Step 8: Thank You (no navigation)
  ];

  /**
   * Handle Joyride callback events
   * @param {CallBackProps} data - Data from Joyride callback
   */
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, type } = data;

    // Logging for debugging
    console.log("Joyride Callback Data:", { status, action, type });

    // Handle tour termination actions
    if (
      status === JoyrideStatus.FINISHED ||
      status === JoyrideStatus.SKIPPED ||
      action === "close" ||
      action === "skip"
    ) {
      console.log("Tour finished or skipped. Closing the tour.");
      setRunTour(false);
      setStepIndex(0); // Reset stepIndex to avoid residual state
      return;
    }

    // Handle step transitions
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      let newStepIndex = stepIndex;

      if (action === "prev") {
        // User clicked the Back button
        newStepIndex = stepIndex - 1;
      } else {
        // User clicked the Next button or triggered an automatic advance
        newStepIndex = stepIndex + 1;
      }

      // Boundary checks to prevent invalid step indices
      newStepIndex = Math.max(0, Math.min(newStepIndex, steps.length - 1));

      console.log("Navigating to step index:", newStepIndex);

      setStepIndex(newStepIndex);

      // Navigate to the corresponding route if applicable
      const targetRoute = stepRoutes[newStepIndex];
      if (targetRoute && location.pathname !== targetRoute) {
        console.log(`Navigating to route: ${targetRoute}`);
        navigate(targetRoute);
      }

      // Additional action for the login modal
      if (newStepIndex === 7) {
        console.log("Opening login modal.");
        setIsLoginOpen(true);
      }

      // Handle completion if it's the last step
      if (newStepIndex === steps.length - 1 && action === "next") {
        console.log("Last step reached. Closing the tour.");
        setRunTour(false);
        setStepIndex(0);
      }
    }
  };

  // Restart the tour when runTour prop changes to true
  useEffect(() => {
    if (runTour) {
      console.log("Tour started.");
      setStepIndex(0);
    }
  }, [runTour]);

  return (
    <Joyride
      debug={true} // Enable debug mode for detailed logs
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      disableScrolling={false}
      spotlightClicks={true}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#0D9488",
          backgroundColor: "#1F1F1F",
          textColor: "#E5E5E5",
          arrowColor: "#1F1F1F",
          overlayColor: "rgba(0, 0, 0, 0.6)",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#0D9488",
          color: "#FFFFFF",
        },
        buttonBack: {
          color: "#FFFFFF",
        },
        buttonSkip: {
          color: "#FFFFFF",
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;
