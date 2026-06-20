import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls to top only on forward navigation (PUSH/REPLACE).
 * On browser back/forward (POP), scroll position is restored naturally.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, navType]);

  return null;
}
