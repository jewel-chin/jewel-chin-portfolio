import p5 from "p5";
import styles from "../../styles/header.module.css";

// TODO: Refactor common logic between the two sketches

export const createEllipsesSketch = (
  headerRef: React.RefObject<HTMLElement | null>,
  toCollapseRef: React.RefObject<boolean>
) => {
  const padding = 10;
  const maxCollapse = 0.3;
  let currentCollapse = 0;

  return (p: p5) => {
    p.setup = () => {
      const hr = headerRef.current;
      if (!hr) return;
      p.createCanvas(hr.offsetWidth, hr.offsetHeight)
        .parent(hr)
        .addClass(styles.solidEllipse);
    };

    p.draw = () => {
      const hr = headerRef.current;
      if (!hr) return;

      p.clear();

      // 1. Smoothly interpolate the collapse value
      const targetCollapse = toCollapseRef.current ? maxCollapse : 0;
      currentCollapse = p.lerp(currentCollapse, targetCollapse, 0.1);

      // 2. Dimensions
      const cx = p.width / 2;
      const cy = p.height / 2;
      const baseH = p.height - padding;

      // 3. Render Ellipses
      p.noFill();
      p.stroke(0, 0, 0, toCollapseRef.current ? 80 : 255);

      for (let i = 0; i < 5; i++) {
        const sizeFactor = Math.pow(1.7, i);
        let w = 100 * sizeFactor;
        let offset = 50 * sizeFactor;

        // Shrink height based on interpolated progress
        const h = baseH * (1 - currentCollapse);

        // Constrain width
        const maxWidth = p.width / 2 - padding;
        if (w > maxWidth || i === 4) {
          w = maxWidth;
          offset = 50 * (w / 100);
        }

        p.ellipse(cx + offset, cy, w, h);
        p.ellipse(cx - offset, cy, w, h);
      }
    };

    p.windowResized = () => {
      if (headerRef.current) {
        p.resizeCanvas(
          headerRef.current.offsetWidth,
          headerRef.current.offsetHeight
        );
      }
    };
  };
};

export const createAsciiEllipsesSketch = (
  headerRef: React.RefObject<HTMLElement | null>,
  toCollapseRef: React.RefObject<boolean>
) => {
  const padding = 10;
  const maxCollapse = 0.3;
  const randomText = ["%", "@", "!", "*", "&", "^", "#"];
  let currentCollapse = 0;

  const drawAsciiEllipse = (
    p: p5,
    cx: number,
    cy: number,
    w: number,
    h: number
  ) => {
    const gap = 12;
    const circumference =
      p.PI *
      (3 * (w / 2 + h / 2) -
        p.sqrt(((3 * w) / 2 + h / 2) * (w / 2 + (3 * h) / 2)));
    const steps = p.floor(circumference / gap);

    for (let i = 0; i < steps; i++) {
      let angle = p.map(i, 0, steps, 0, p.TWO_PI);
      const x = cx + (w / 2) * p.cos(angle);
      const y = cy + (h / 2) * p.sin(angle);

      // Randomly select a character for the "pixel"
      const char = randomText[p.floor(p.random(randomText.length))];
      p.text(char, x, y);
    }
  };

  return (p: p5) => {
    p.setup = () => {
      const hr = headerRef.current;
      if (!hr) return;
      p.createCanvas(hr.offsetWidth, hr.offsetHeight)
        .parent(hr)
        .addClass(styles.mask);

      p.textFont("monospace");
      p.textSize(8);
      p.textAlign(p.CENTER, p.CENTER);
      p.frameRate(24);
    };

    p.draw = () => {
      const hr = headerRef.current;
      if (!hr) return;

      p.clear();

      // Animate collapse progress
      const targetCollapse = toCollapseRef.current ? maxCollapse : 0;
      currentCollapse = p.lerp(currentCollapse, targetCollapse, 0.1);

      const cx = p.width / 2;
      const cy = p.height / 2;
      const baseH = p.height - padding;

      p.noStroke();
      p.fill(0, 0, 0, toCollapseRef.current ? 100 : 255);

      for (let i = 0; i < 5; i++) {
        const sizeFactor = Math.pow(1.7, i);
        let w = 100 * sizeFactor;
        let offset = 50 * sizeFactor;
        const h = baseH * (1 - currentCollapse);

        const maxWidth = p.width / 2 - padding;
        if (w > maxWidth || i === 4) {
          w = maxWidth;
          offset = 50 * (w / 100);
        }

        drawAsciiEllipse(p, cx + offset, cy, w, h);
        drawAsciiEllipse(p, cx - offset, cy, w, h);
      }
    };

    p.windowResized = () => {
      if (headerRef.current) {
        p.resizeCanvas(
          headerRef.current.offsetWidth,
          headerRef.current.offsetHeight
        );
      }
    };
  };
};
