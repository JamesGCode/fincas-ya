"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "@/lib/utils";

type ScrollAxis = "horizontal" | "vertical" | "both";

interface ScrollFadeProps {
  children: React.ReactNode;
  className?: string;
  hideScrollbar?: boolean;
  axis?: ScrollAxis;
  dragToScroll?: boolean;
}

export const ScrollFade = forwardRef<HTMLDivElement, ScrollFadeProps>(
  (
    {
      children,
      className,
      hideScrollbar = true,
      axis = "horizontal",
      dragToScroll = true,
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [showBottom, setShowBottom] = useState(false);

    // Drag to scroll state
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const scrollLeft = useRef(0);
    const scrollTop = useRef(0);

    useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    const checkScroll = () => {
      const el = internalRef.current;
      if (!el) return;

      const {
        scrollLeft: sLeft,
        scrollTop: sTop,
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
      } = el;

      if (axis === "horizontal" || axis === "both") {
        setShowLeft(sLeft > 0);
        setShowRight(
          Math.ceil(sLeft + clientWidth) < Math.floor(scrollWidth - 1),
        );
      }

      if (axis === "vertical" || axis === "both") {
        setShowTop(sTop > 0);
        setShowBottom(
          Math.ceil(sTop + clientHeight) < Math.floor(scrollHeight - 1),
        );
      }
    };

    useLayoutEffect(() => {
      requestAnimationFrame(checkScroll);
    }, [axis]);

    useEffect(() => {
      const container = internalRef.current;
      if (!container) return;

      const onScroll = () => checkScroll();
      container.addEventListener("scroll", onScroll, { passive: true });

      const ro = new ResizeObserver(() => checkScroll());
      if (contentRef.current) ro.observe(contentRef.current);
      ro.observe(container);

      const onResize = () => checkScroll();
      window.addEventListener("resize", onResize);

      const raf = requestAnimationFrame(checkScroll);

      // Drag to scroll logic
      const handleMouseDown = (e: MouseEvent) => {
        if (!dragToScroll) return;
        isDragging.current = true;
        container.classList.add("cursor-grabbing");
        startX.current = e.pageX - container.offsetLeft;
        startY.current = e.pageY - container.offsetTop;
        scrollLeft.current = container.scrollLeft;
        scrollTop.current = container.scrollTop;
      };

      const handleMouseLeave = () => {
        isDragging.current = false;
        container.classList.remove("cursor-grabbing");
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        container.classList.remove("cursor-grabbing");
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();

        if (axis === "horizontal" || axis === "both") {
          const x = e.pageX - container.offsetLeft;
          const walkX = (x - startX.current) * 2; // scroll-fast
          container.scrollLeft = scrollLeft.current - walkX;
        }

        if (axis === "vertical" || axis === "both") {
          const y = e.pageY - container.offsetTop;
          const walkY = (y - startY.current) * 2;
          container.scrollTop = scrollTop.current - walkY;
        }
      };

      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mousemove", handleMouseMove);

      return () => {
        container.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mousemove", handleMouseMove);
        ro.disconnect();
        cancelAnimationFrame(raf);
      };
    }, [axis, dragToScroll]);

    return (
      <div className="relative group/scroll-fade">
        <div
          ref={internalRef}
          className={cn(
            "relative",
            hideScrollbar &&
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            axis === "horizontal" && "w-full overflow-x-auto overflow-y-hidden",
            axis === "vertical" && "h-full overflow-y-auto overflow-x-hidden",
            axis === "both" && "overflow-auto",
            dragToScroll && "cursor-grab active:cursor-grabbing select-none",
            className,
          )}
        >
          <div
            ref={contentRef}
            className={cn(
              axis === "horizontal" && "w-fit min-w-full",
              axis === "vertical" && "h-fit min-h-full",
              axis === "both" && "min-w-full min-h-full w-fit h-fit",
              "pointer-events-auto", // Ensure children can be clicked
            )}
          >
            {children}
          </div>
        </div>

        {(axis === "horizontal" || axis === "both") && showLeft && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-full w-32 z-20 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to right, var(--background) 0%, var(--background) 20%, transparent 100%)",
            }}
          />
        )}

        {(axis === "horizontal" || axis === "both") && showRight && (
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-full w-32 z-20 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to left, var(--background) 0%, var(--background) 20%, transparent 100%)",
            }}
          />
        )}

        {(axis === "vertical" || axis === "both") && showTop && (
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 w-full h-32 z-20 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to bottom, var(--background) 0%, var(--background) 20%, transparent 100%)",
            }}
          />
        )}

        {(axis === "vertical" || axis === "both") && showBottom && (
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 w-full h-32 z-20 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to top, var(--background) 0%, var(--background) 20%, transparent 100%)",
            }}
          />
        )}
      </div>
    );
  },
);

ScrollFade.displayName = "ScrollFade";
