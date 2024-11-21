import { useEffect } from "react";

export function useWarnOnUnsavedChanges(isChanged) {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isChanged) {
        // Display a custom message (most browsers don't show it but alert the user)
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    if (isChanged) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup listener on unmount or syncState change
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isChanged]);
}
