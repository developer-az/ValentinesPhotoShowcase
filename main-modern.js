// Modernized main script for Valentine's Photo Showcase
import HeartAnimationManager from './js/heartAnimation.js';
import { ThemeManager } from './js/themeManager.js';
import { debounce } from './js/utils.js';

class ValentineApp {
  constructor() {
    this.heartManager = null;
    this.themeManager = null;
    this.isCardOpened = false;
    
    // Bind methods
    this.handleCardToggle = this.handleCardToggle.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Initialize components
      this.initializeThemeManager();
      this.initializeHeartAnimation();
      this.initializeCardInteraction();
      this.initializeAccessibility();
      this.initializePerformanceOptimizations();
      
      console.log('Valentine App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Valentine App:', error);
      this.handleInitError(error);
    }
  }

  /**
   * Initialize theme management
   */
  initializeThemeManager() {
    this.themeManager = new ThemeManager();
    
    // Add theme toggle button
    this.addThemeToggle();
  }

  /**
   * Add theme toggle button to the page
   */
  addThemeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle dark/light theme');
    toggleButton.innerHTML = `
      <span class="theme-toggle-icon">🌙</span>
      <span class="sr-only">Toggle theme</span>
    `;
    
    toggleButton.addEventListener('click', () => {
      this.themeManager.toggleTheme();
    });

    // Update button icon when theme changes
    this.themeManager.onChange((theme) => {
      const icon = toggleButton.querySelector('.theme-toggle-icon');
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      toggleButton.setAttribute('aria-label', 
        `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    });

    document.body.appendChild(toggleButton);
  }

  /**
   * Initialize heart animation system
   */
  initializeHeartAnimation() {
    const heartContainer = document.getElementById('heart2-container');
    if (heartContainer) {
      this.heartManager = new HeartAnimationManager('heart2-container');
      this.heartManager.start();
    }
  }

  /**
   * Initialize card interaction
   */
  initializeCardInteraction() {
    const checkbox = document.getElementById('open');
    const cardLabel = document.querySelector('.open');
    
    if (checkbox && cardLabel) {
      // Enhance accessibility
      cardLabel.setAttribute('role', 'button');
      cardLabel.setAttribute('aria-label', 'Open Valentine card');
      cardLabel.setAttribute('tabindex', '0');
      
      checkbox.addEventListener('change', this.handleCardToggle);
      
      // Add keyboard support
      cardLabel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          this.handleCardToggle();
        }
      });
    }
  }

  /**
   * Handle card toggle interaction
   */
  handleCardToggle() {
    const checkbox = document.getElementById('open');
    const cardLabel = document.querySelector('.open');
    
    if (checkbox.checked && !this.isCardOpened) {
      this.isCardOpened = true;
      
      // Update accessibility
      if (cardLabel) {
        cardLabel.setAttribute('aria-label', 'Card opened, redirecting...');
      }
      
      // Add loading state
      this.showLoadingState();
      
      // Navigate after delay with better UX
      setTimeout(() => {
        this.navigateToSecondPage();
      }, 3000);
    }
  }

  /**
   * Show loading state while card opens
   */
  showLoadingState() {
    const note = document.querySelector('.note');
    if (note) {
      note.innerHTML = `
        <div class="loading-content">
          Opening your Valentine... 
          <span class="loading-hearts">💖</span>
        </div>
      `;
    }
  }

  /**
   * Navigate to second page with error handling
   */
  navigateToSecondPage() {
    try {
      window.location.href = 'page.html';
    } catch (error) {
      console.error('Navigation failed:', error);
      this.showError('Unable to open Valentine card. Please try again.');
    }
  }

  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Add skip link
    this.addSkipLink();
    
    // Add keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard);
    
    // Announce page changes for screen readers
    this.announcePageReady();
  }

  /**
   * Add skip link for keyboard navigation
   */
  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const mainContent = document.querySelector('.valentines-day-card');
    if (mainContent) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    // ESC key to close any open modals or go back
    if (event.key === 'Escape') {
      // Could be used for future modal implementations
    }
  }

  /**
   * Announce page ready for screen readers
   */
  announcePageReady() {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Valentine card loaded and ready to open';
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  /**
   * Initialize performance optimizations
   */
  initializePerformanceOptimizations() {
    // Pause animations when page is not visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Preload second page for faster navigation
    this.preloadSecondPage();
  }

  /**
   * Handle visibility changes for performance
   */
  handleVisibilityChange() {
    if (document.hidden && this.heartManager) {
      this.heartManager.stop();
    } else if (!document.hidden && this.heartManager) {
      this.heartManager.start();
    }
  }

  /**
   * Preload second page for faster navigation
   */
  preloadSecondPage() {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'page.html';
    document.head.appendChild(link);
  }

  /**
   * Show error message to user
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  /**
   * Handle initialization errors
   */
  handleInitError(error) {
    this.showError('Some features may not work properly. Please refresh the page.');
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.heartManager) {
      this.heartManager.destroy();
    }
    
    document.removeEventListener('keydown', this.handleKeyboard);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

// Initialize app
const app = new ValentineApp();

// Make available globally for debugging
window.ValentineApp = app;