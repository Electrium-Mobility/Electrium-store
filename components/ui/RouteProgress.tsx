"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * RouteProgress
 * Lightweight top progress bar shown during route transitions.
 * - Starts when user clicks internal links
 * - Completes on pathname change
 * - No history hijacking; purely visual feedback
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Animate progress towards 85% while loading
  const startProgress = () => {
    if (active) return;
    setActive(true);
    setWidth(0);
    startTimeRef.current = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTimeRef.current;
      // Ease-out towards 85% over ~600ms
      const target = 85;
      const duration = 600;
      const progress = Math.min((elapsed / duration) * target, target);
      setWidth(progress);
      if (progress < target && active) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const completeProgress = () => {
    setWidth(100);
    // Allow the bar to reach 100% briefly, then hide
    setTimeout(() => {
      setActive(false);
      setWidth(0);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, 200);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = (anchor as HTMLAnchorElement).href;
      const targetAttr = (anchor as HTMLAnchorElement).target;
      const isModified = (e as MouseEvent).metaKey || (e as MouseEvent).ctrlKey || (e as MouseEvent).shiftKey || (e as MouseEvent).altKey;
      // Only start for same-origin, in-tab navigations
      if (!isModified && (!targetAttr || targetAttr === "") && href && href.startsWith(window.location.origin)) {
        startProgress();
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true } as any);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When pathname changes, complete the progress
  useEffect(() => {
    if (active) {
      completeProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div aria-hidden className="pointer-events-none fixed top-0 left-0 right-0 z-[1000]">
      <div
        className="h-0.5 bg-[hsl(var(--btn-primary))] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-[width] duration-200 ease-out"
        style={{ width: active ? `${width}%` : "0%" }}
      />
    </div>
  );
}