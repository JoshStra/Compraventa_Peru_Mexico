import { useEffect, useRef, useState } from "react";
import { readNavigation, navigationUrl } from "../domain/catalogNavigation.js";

export function useCatalogNavigation() {
  const [navigation, setNavigation] = useState(() =>
    readNavigation(window.location.search),
  );
  const previous = useRef(navigation);
  useEffect(() => {
    const restore = () => {
      const next = readNavigation(window.location.search);
      previous.current = next;
      setNavigation(next);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    const target = navigationUrl(window.location.href, navigation);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (target !== current) {
      const method =
        previous.current.view === navigation.view
          ? "replaceState"
          : "pushState";
      window.history[method](window.history.state, "", target);
    }
    document.title =
      navigation.view === "Inicio"
        ? "CampusTrade"
        : `${navigation.view} · CampusTrade`;
    previous.current = navigation;
  }, [navigation]);
  const setView = (view) => setNavigation((current) => ({ ...current, view }));
  const setFilters = (update) =>
    setNavigation((current) => ({
      ...current,
      filters: typeof update === "function" ? update(current.filters) : update,
    }));
  return { ...navigation, setView, setFilters };
}
