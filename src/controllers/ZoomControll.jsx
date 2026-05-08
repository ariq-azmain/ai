"use client";
import { useEffect } from "react";

export default function ZoomControl() {
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Ctrl + Scroll stop zoom
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);
  useEffect(() => {
    // 2. pinch zoon stop
    const handleTouch = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // doble tap zoom stop
    let lastTouchEnd = 0;
    const handleTouchEnd = (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchstart', handleTouch, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      document.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  return null;
}
