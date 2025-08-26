// Modernized Valentine's Photo Showcase - Compatible Version
(function() {
  'use strict';

  // Utility functions
  const Utils = {
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    randomBetween: function(min, max) {
      return Math.random() * (max - min) + min;
    },

    createHeartElement: function() {
      const heart = document.createElement('div');
      heart.className = 'heart2';
      heart.setAttribute('aria-hidden', 'true');
      return heart;
    }
  };

  // Theme Manager
  class ThemeManager {
    constructor() {
      this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
      this.listeners = new Set();
      
      this.applyTheme(this.currentTheme);
      this.setupSystemThemeListener();
    }

    getStoredTheme() {
      try {
        return localStorage.getItem('valentine-theme');
      } catch (e) {
        console.warn('Could not access localStorage for theme');
        return null;
      }
    }

    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    storeTheme(theme) {
      try {
        localStorage.setItem('valentine-theme', theme);
      } catch (e) {
        console.warn('Could not store theme preference');
      }
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.currentTheme = theme;
      this.storeTheme(theme);
      
      this.listeners.forEach(callback => callback(theme));
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
    }

    getCurrentTheme() {
      return this.currentTheme;
    }

    onChange(callback) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }

    setupSystemThemeListener() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // Heart Animation Manager
  class HeartAnimationManager {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.heartWidth = 20;
      this.maxHearts = 15;
      this.hearts = new Set();
      this.isRunning = false;
      
      this.createHeart = this.createHeart.bind(this);
      this.handleResize = Utils.debounce(this.handleResize.bind(this), 250);
      
      window.addEventListener('resize', this.handleResize);
    }

    createHeart() {
      if (Utils.prefersReducedMotion() || this.hearts.size >= this.maxHearts || !this.container) {
        return;
      }

      const heart = Utils.createHeartElement();
      const containerRect = this.container.getBoundingClientRect();
      const containerWidth = containerRect.width || window.innerWidth;
      
      const leftPosition = Utils.randomBetween(0, containerWidth - this.heartWidth);
      heart.style.left = `${leftPosition}px`;
      heart.style.top = '100vh';
      heart.style.opacity = Utils.randomBetween(0.3, 1);
      
      this.container.appendChild(heart);
      this.hearts.add(heart);

      // Simple CSS animation fallback
      heart.style.transition = `transform ${Utils.randomBetween(6, 10)}s ease-in-out, opacity ${Utils.randomBetween(6, 10)}s ease-in-out`;
      
      requestAnimationFrame(() => {
        heart.style.transform = 'translateY(-100vh) rotate(360deg)';
        heart.style.opacity = '0';
      });

      setTimeout(() => {
        this.removeHeart(heart);
      }, 12000);
    }

    removeHeart(heart) {
      if (this.hearts.has(heart)) {
        this.hearts.delete(heart);
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }
    }

    start() {
      if (this.isRunning) return;
      
      this.isRunning = true;
      const intervals = [400, 500, 700];
      this.intervalIds = intervals.map(interval => 
        setInterval(this.createHeart, interval)
      );
    }

    stop() {
      if (!this.isRunning) return;
      
      this.isRunning = false;
      
      if (this.intervalIds) {
        this.intervalIds.forEach(id => clearInterval(id));
        this.intervalIds = null;
      }
      
      this.hearts.forEach(heart => this.removeHeart(heart));
    }

    handleResize() {
      this.hearts.forEach(heart => {
        const currentLeft = parseFloat(heart.style.left);
        const maxLeft = window.innerWidth - this.heartWidth;
        if (currentLeft > maxLeft) {
          heart.style.left = `${maxLeft}px`;
        }
      });
    }

    destroy() {
      this.stop();
      window.removeEventListener('resize', this.handleResize);
      this.container = null;
    }
  }

  // Main Application
  class ValentineApp {
    constructor() {
      this.heartManager = null;
      this.themeManager = null;
      this.isCardOpened = false;
      
      this.handleCardToggle = this.handleCardToggle.bind(this);
      this.handleKeyboard = this.handleKeyboard.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      
      this.init();
    }

    async init() {
      try {
        if (document.readyState === 'loading') {
          await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
          });
        }

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

    initializeThemeManager() {
      this.themeManager = new ThemeManager();
      this.addThemeToggle();
    }

    addThemeToggle() {
      // Check if toggle already exists
      if (document.querySelector('.theme-toggle')) return;

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

      this.themeManager.onChange((theme) => {
        const icon = toggleButton.querySelector('.theme-toggle-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggleButton.setAttribute('aria-label', 
          `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
      });

      document.body.appendChild(toggleButton);
    }

    initializeHeartAnimation() {
      const heartContainer = document.getElementById('heart2-container');
      if (heartContainer) {
        this.heartManager = new HeartAnimationManager('heart2-container');
        this.heartManager.start();
      }
    }

    initializeCardInteraction() {
      const checkbox = document.getElementById('open');
      const cardLabel = document.querySelector('.open');
      
      if (checkbox && cardLabel) {
        cardLabel.setAttribute('role', 'button');
        cardLabel.setAttribute('aria-label', 'Open Valentine card');
        cardLabel.setAttribute('tabindex', '0');
        
        checkbox.addEventListener('change', this.handleCardToggle);
        
        cardLabel.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            this.handleCardToggle();
          }
        });
      }
    }

    handleCardToggle() {
      const checkbox = document.getElementById('open');
      const cardLabel = document.querySelector('.open');
      
      if (checkbox.checked && !this.isCardOpened) {
        this.isCardOpened = true;
        
        if (cardLabel) {
          cardLabel.setAttribute('aria-label', 'Card opened, redirecting...');
        }
        
        this.showLoadingState();
        
        setTimeout(() => {
          this.navigateToSecondPage();
        }, 3000);
      }
    }

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

    navigateToSecondPage() {
      try {
        window.location.href = 'page.html';
      } catch (error) {
        console.error('Navigation failed:', error);
        this.showError('Unable to open Valentine card. Please try again.');
      }
    }

    initializeAccessibility() {
      this.addSkipLink();
      document.addEventListener('keydown', this.handleKeyboard);
      this.announcePageReady();
    }

    addSkipLink() {
      // Check if skip link already exists
      if (document.querySelector('.skip-link')) return;

      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      
      document.body.insertBefore(skipLink, document.body.firstChild);
      
      const mainContent = document.querySelector('.valentines-day-card');
      if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
      }
    }

    handleKeyboard(event) {
      if (event.key === 'Escape') {
        // Future modal support
      }
    }

    announcePageReady() {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Valentine card loaded and ready to open';
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        announcement.remove();
      }, 1000);
    }

    initializePerformanceOptimizations() {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      this.preloadSecondPage();
    }

    handleVisibilityChange() {
      if (document.hidden && this.heartManager) {
        this.heartManager.stop();
      } else if (!document.hidden && this.heartManager) {
        this.heartManager.start();
      }
    }

    preloadSecondPage() {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = 'page.html';
      document.head.appendChild(link);
    }

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

    handleInitError(error) {
      this.showError('Some features may not work properly. Please refresh the page.');
    }

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

})();