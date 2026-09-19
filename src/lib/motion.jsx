import { createElement, forwardRef, useEffect, useState } from "react";

const strippedProps = new Set([
  "animate", "drag", "dragConstraints", "dragElastic", "exit", "initial",
  "layout", "transition", "whileTap", "custom", "variants", "onDragEnd",
]);

function createMotionElement(tag) {
  return forwardRef(function MotionElement(props, ref) {
    const htmlProps = Object.fromEntries(Object.entries(props).filter(([key]) => !strippedProps.has(key)));
    return createElement(tag, { ...htmlProps, ref });
  });
}

export const motion = new Proxy({}, {
  get(target, tag) {
    if (!target[tag]) target[tag] = createMotionElement(tag);
    return target[tag];
  },
});

export function AnimatePresence({ children }) {
  return children;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
