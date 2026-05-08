'use client'
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import { useEffect } from 'react'

const GSAPInit = () => {
  useEffect(() => {
    gsap.registerPlugin(Draggable);
  }, [])
  return null;
}
export default GSAPInit;