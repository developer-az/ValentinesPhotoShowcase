// Modern heart animation system
import { prefersReducedMotion, randomBetween, createHeartElement, debounce } from './utils.js';

class HeartAnimationManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.heartWidth = 20;
    this.maxHearts = 15; // Limit simultaneous hearts for performance
    this.hearts = new Set();
    this.isRunning = false;
    this.animationFrame = null;
    
    // Bind methods
    this.createHeart = this.createHeart.bind(this);
    this.cleanupHearts = this.cleanupHearts.bind(this);
    this.handleResize = debounce(this.handleResize.bind(this), 250);
    
    // Setup resize listener
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Create and animate a new heart
   */
  createHeart() {
    if (prefersReducedMotion() || this.hearts.size >= this.maxHearts) {
      return;
    }

    const heart = createHeartElement();
    const containerRect = this.container.getBoundingClientRect();
    const containerWidth = containerRect.width || window.innerWidth;
    
    // Position heart randomly
    const leftPosition = randomBetween(0, containerWidth - this.heartWidth);
    heart.style.left = `${leftPosition}px`;
    heart.style.top = '100vh';
    heart.style.opacity = randomBetween(0.3, 1);
    
    // Add to DOM and track
    this.container.appendChild(heart);
    this.hearts.add(heart);

    // Animate using Web Animations API
    const animation = heart.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: heart.style.opacity },
      { transform: 'translateY(-100vh) rotate(360deg)', opacity: 0 }
    ], {
      duration: randomBetween(6000, 10000),
      easing: 'ease-in-out'
    });

    // Cleanup when animation finishes
    animation.addEventListener('finish', () => {
      this.removeHeart(heart);
    });
  }

  /**
   * Remove heart from DOM and tracking
   */
  removeHeart(heart) {
    if (this.hearts.has(heart)) {
      this.hearts.delete(heart);
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }
  }

  /**
   * Start heart animation system
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Create hearts at different intervals for natural effect
    const intervals = [400, 500, 700];
    this.intervalIds = intervals.map(interval => 
      setInterval(this.createHeart, interval)
    );
  }

  /**
   * Stop heart animation system
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    
    // Clear intervals
    if (this.intervalIds) {
      this.intervalIds.forEach(id => clearInterval(id));
      this.intervalIds = null;
    }
    
    // Remove all existing hearts
    this.hearts.forEach(heart => this.removeHeart(heart));
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Adjust positions of existing hearts if needed
    this.hearts.forEach(heart => {
      const currentLeft = parseFloat(heart.style.left);
      const maxLeft = window.innerWidth - this.heartWidth;
      if (currentLeft > maxLeft) {
        heart.style.left = `${maxLeft}px`;
      }
    });
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    this.container = null;
  }
}

export default HeartAnimationManager;