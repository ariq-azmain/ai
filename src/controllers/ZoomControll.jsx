// একটি ক্লায়েন্ট কম্পোনেন্টে এটি ব্যবহার করুন
"use client";
import { useEffect } from "react";

export default function ZoomControl() {
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Ctrl + Scroll জুম বন্ধ করবে
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);
useEffect(() => {
    // ২ আঙ্গুলে পিন্চ জুম আটকানোর জন্য
    const handleTouch = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // ডাবল ট্যাপ জুম আটকানোর জন্য
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
