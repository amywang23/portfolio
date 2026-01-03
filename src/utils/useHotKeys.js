import { useEffect } from "react";

export function useHotKeys(map) {
  useEffect(() => {
    function handler(e) {
      const key = e.key.toLowerCase();
      if (map[key]) map[key](e);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [map]);
}
