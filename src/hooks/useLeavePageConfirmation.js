"use client";
import { useEffect } from "react";

// The App Router has no route-change-cancel API (unlike the old pages
// router's router.events), so this only guards the cases the browser itself
// exposes a hook for: closing the tab, refreshing, or typing a new URL.
// It can't intercept an in-app <Link> click — pair it with a visible
// "unsaved changes" affordance in the UI for that case.
export const useLeavePageConfirmation = (shouldPreventLeaving) => {
  useEffect(() => {
    if (!shouldPreventLeaving) {
      return;
    }

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldPreventLeaving]);
};

export default useLeavePageConfirmation;
