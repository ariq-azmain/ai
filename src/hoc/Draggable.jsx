"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import gsap from "gsap";

const DraggableEl = (Component) => {
    const buttonRef = useRef(null);
    gsap.registerPlugin(Draggable);
    useGSAP(() => {
        const el = buttonRef.current;
        if (!el) return;
        Draggable.create(el, {
            onPress: () => {
                console.log("press");
            }
        });
    }, []);
    return (
        <div ref={buttonRef}>
            <Component />
        </div>
    );
};

export default DraggableEl;
