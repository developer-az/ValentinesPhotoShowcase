// Modern utility functions for Valentine's Photo Showcase

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Animate element with modern Web Animations API
 * @param {HTMLElement} element - Element to animate
 * @param {Object} keyframes - Animation keyframes
 * @param {Object} options - Animation options
 * @returns {Animation} Animation instance
 */
export const animateElement = (element, keyframes, options = {}) => {
  if (prefersReducedMotion()) {
    return null;
  }
  return element.animate(keyframes, {
    duration: 1000,
    easing: 'ease-out',
    ...options
  });
};

/**
 * Create optimized heart element
 * @returns {HTMLElement} Heart element
 */
export const createHeartElement = () => {
  const heart = document.createElement('div');
  heart.className = 'heart2';
  heart.setAttribute('aria-hidden', 'true');
  return heart;
};