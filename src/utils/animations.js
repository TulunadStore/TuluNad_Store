// src/utils/animations.js

/**
 * Defines variants for page transitions.
 * - 'initial': The starting state of the page (off-screen and faded out).
 * - 'animate': The state when the page is visible (on-screen and fully opaque).
 * - 'exit': The state when the page is navigating away (off-screen and faded out).
 */
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeInOut' } },
};

/**
 * Defines a simple fade-in animation.
 * Useful for elements that should appear smoothly.
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * Defines a hover effect for interactive items.
 * The item will slightly scale up when hovered over.
 */
export const itemHover = {
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
};

/**
 * Defines a click/tap effect for buttons.
 * The button will slightly scale down when pressed.
 */
export const buttonClick = {
  tap: { scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 15 } },
};

/**
 * Defines a "scribble" drawing animation for SVG paths.
 */
export const scribbleAnimation = {
    initial: { pathLength: 0, opacity: 0 },
    draw: {
      pathLength: 1,
      opacity: 0.7,
      transition: {
        duration: 2,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
};
