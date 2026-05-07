"use client";

import { useCallback, useRef } from "react";

export function useHorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.88, 640);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  return { ref, scroll };
}
