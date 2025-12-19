"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useMousePosition from "../../helpers/useMousePosition";
import styles from "../../styles/header.module.css";
import {
  createAsciiEllipsesSketch,
  createEllipsesSketch,
} from "./ellipseSketch";

const animation = {
  initial: { y: "20%", opacity: 0 },
  enter: {
    y: "0",
    opacity: 1,
    transition: { duration: 1, ease: [0.33, 1, 0.68, 1] },
  },
};

const EllipseCollapsibleHeader: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const { x, y } = useMousePosition();
  const lastScrollY = useRef(0);

  // Refs for p5 (no re-render)
  const toCollapseRef = useRef(false);

  // State for React UI (triggers re-render for text color)
  const [isDimmed, setIsDimmed] = useState(false);

  useEffect(() => {
    let p5Instance: any;
    let p5InstanceAscii: any;

    const initP5 = async () => {
      const p5 = (await import("p5")).default;
      const sketch = createEllipsesSketch(headerRef, toCollapseRef);
      const asciiSketch = createAsciiEllipsesSketch(headerRef, toCollapseRef);

      p5Instance = new p5(sketch);
      p5InstanceAscii = new p5(asciiSketch);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown =
        currentScrollY > lastScrollY.current && currentScrollY > 10;

      if (scrollingDown !== toCollapseRef.current) {
        toCollapseRef.current = scrollingDown;
        setIsDimmed(scrollingDown); // Trigger React re-render for text
      }
      lastScrollY.current = currentScrollY;
    };

    initP5();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      p5Instance?.remove();
      p5InstanceAscii?.remove();
    };
  }, []);

  // Handle Cursor Mask
  useEffect(() => {
    const mask = document.querySelector(`.${styles.mask}`) as HTMLElement;
    if (mask) {
      const size = 100;
      mask.style.maskPosition = `${x - size / 2}px ${y - size / 2}px`;
    }
  }, [x, y]);

  const baseClasses = `
    bg-white/95 rounded-md z-10 px-2 relative transition-colors duration-300
  `;

  const textClasses = isDimmed ? "text-black/40" : "text-black";

  const scrollTo = (id: string) => {
    const el =
      id === "footer"
        ? document.querySelector("footer")
        : document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      variants={animation}
      initial="initial"
      animate="enter"
      ref={headerRef}
      className="fixed flex items-center top-0 z-50 w-full h-16"
    >
      <ul className="flex w-full justify-between px-8 cursor-pointer">
        {["ABOUT ME", "WORKS", "CONTACT"].map((label) => (
          <li
            key={label}
            className={`${baseClasses} ${textClasses}`}
            onClick={() => scrollTo(label.toLowerCase().replace(" ", ""))}
          >
            {label}
          </li>
        ))}
      </ul>
    </motion.header>
  );
};

export default EllipseCollapsibleHeader;
