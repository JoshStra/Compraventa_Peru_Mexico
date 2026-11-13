import { useCallback, useEffect, useState } from "react";

export function useReadMarkers(userId, threads) {
  const [markers, setMarkers] = useState({});
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(`campustrade:read:${userId}`) || "{}",
      );
      setMarkers(
        stored && typeof stored === "object" && !Array.isArray(stored)
          ? stored
          : {},
      );
    } catch {
      setMarkers({});
    }
  }, [userId]);
  const onRead = useCallback(
    (thread) => {
      if (!userId || !thread) return;
      const time = new Date(thread.updatedAt).getTime();
      if (!Number.isFinite(time)) return;
      setMarkers((current) => {
        if (current[thread.id] === time) return current;
        const next = { ...current, [thread.id]: time };
        try {
          localStorage.setItem(
            `campustrade:read:${userId}`,
            JSON.stringify(next),
          );
        } catch {
          /* Reading the chat still works without browser storage. */
        }
        return next;
      });
    },
    [userId],
  );
  const unread = Boolean(
    userId &&
    threads.some(
      (thread) =>
        thread.lastMessage &&
        new Date(thread.updatedAt).getTime() > Number(markers[thread.id] || 0),
    ),
  );
  return { unread, onRead };
}
