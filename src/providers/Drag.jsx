"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import gsap from "gsap";

const DraggableEl = ({ children, bounds = "html" }) => {
  const buttonRef = useRef(null);
  gsap.registerPlugin(Draggable);

  useGSAP(() => {
    const el = buttonRef.current;
    if (!el) return;

    Draggable.create(el, {
      type: "x,y", // x,y দুই দিকেই ড্র্যাগ
      bounds: window, // এটাই মেইন ফিক্স
      inertia: true, // ছাড়লে একটু স্লাইড করবে - নেটিভ ফিল
      edgeResistance: 0.65, // বর্ডারে ধাক্কা খেলে রেজিস্ট করবে
      cursor: "grab",
      activeCursor: "grabbing",
      allowContextMenu: false, // লং প্রেস মেনু বন্ধ
      onPress: function () {
        gsap.set(this.target, { cursor: "grabbing" });
      },
      onDragEnd: function () {
        // বাউন্ডারির বাইরে গেলে অটো ভিতরে আসবে
        console.log("drag end x: ", this.x, ' y: ', this.y);
      }
    });
  }, [bounds]);

  return (
    <span ref={buttonRef} className="touch-none select-none whitespace-nowrap absolute w-max h-max">
      {children}
    </span>
  );
};

export default DraggableEl;