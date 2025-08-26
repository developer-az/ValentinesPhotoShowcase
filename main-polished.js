// Valentine's Photo Showcase - Polished Version
(function() {
  'use strict';

  // Feature detection and graceful degradation
  const hasLocalStorage = (function() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  })();

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
      if (!window.matchMedia) return false;
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
    },

    safeQuerySelector: function(selector) {
      try {
        return document.querySelector(selector);
      } catch(e) {
        console.warn('Invalid selector:', selector);
        return null;
      }
    }
  };

  // Theme Manager with better error handling
  class ThemeManager {
    constructor() {
      try {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.listeners = new Set();
        
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
      } catch(e) {
        console.warn('Theme manager initialization failed:', e);
        this.currentTheme = 'light';
        this.listeners = new Set();
      }
    }

    getStoredTheme() {
      if (!hasLocalStorage) return null;
      try {
        return localStorage.getItem('valentine-theme');
      } catch (e) {
        return null;
      }
    }

    getSystemTheme() {
      try {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch(e) {
        return 'light';
      }
    }

    storeTheme(theme) {
      if (!hasLocalStorage) return;
      try {
        localStorage.setItem('valentine-theme', theme);
      } catch (e) {
        // Silent fail
      }
    }

    applyTheme(theme) {
      try {
        if (document.documentElement) {
          document.documentElement.setAttribute('data-theme', theme);
        }
        this.currentTheme = theme;
        this.storeTheme(theme);
        
        // Notify listeners safely
        this.listeners.forEach(callback => {
          try {
            callback(theme);
          } catch(e) {
            console.warn('Theme callback error:', e);
          }
        });
      } catch(e) {
        console.warn('Failed to apply theme:', e);
      }
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
    }

    getCurrentTheme() {
      return this.currentTheme || 'light';
    }

    onChange(callback) {
      if (typeof callback === 'function') {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
      }
      return () => {};
    }

    setupSystemThemeListener() {
      try {
        if (window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handler = (e) => {
            if (!this.getStoredTheme()) {
              this.applyTheme(e.matches ? 'dark' : 'light');
            }
          };
          
          if (mediaQuery.addListener) {
            mediaQuery.addListener(handler);
          } else if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handler);
          }
        }
      } catch(e) {
        // Silent fail for older browsers
      }
    }
  }

  // Heart Animation Manager with better error handling
  class HeartAnimationManager {
    constructor(containerId) {
      try {
        this.container = document.getElementById(containerId);
        if (!this.container) {
          console.warn('Heart container not found:', containerId);
          return;
        }
        
        this.heartWidth = 20;
        this.maxHearts = 15;
        this.hearts = new Set();
        this.isRunning = false;
        
        this.createHeart = this.createHeart.bind(this);
        this.handleResize = Utils.debounce(this.handleResize.bind(this), 250);
        
        if (window.addEventListener) {
          window.addEventListener('resize', this.handleResize);
        }
      } catch(e) {
        console.warn('Heart animation initialization failed:', e);
      }
    }

    createHeart() {
      try {
        if (Utils.prefersReducedMotion() || this.hearts.size >= this.maxHearts || !this.container) {
          return;
        }

        const heart = Utils.createHeartElement();
        if (!heart) return;
        
        const containerRect = this.container.getBoundingClientRect();
        const containerWidth = containerRect.width || window.innerWidth;
        
        const leftPosition = Utils.randomBetween(0, Math.max(0, containerWidth - this.heartWidth));
        heart.style.left = `${leftPosition}px`;
        heart.style.top = '100vh';
        heart.style.opacity = Utils.randomBetween(0.3, 1);
        
        this.container.appendChild(heart);
        this.hearts.add(heart);

        // Enhanced animation with fallback
        const duration = Utils.randomBetween(6, 10);
        if (heart.animate && typeof heart.animate === 'function') {
          // Modern browsers with Web Animations API
          const animation = heart.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: heart.style.opacity },
            { transform: 'translateY(-100vh) rotate(360deg)', opacity: 0 }
          ], {
            duration: duration * 1000,
            easing: 'ease-in-out'
          });
          
          animation.addEventListener('finish', () => {
            this.removeHeart(heart);
          });
        } else {
          // Fallback for older browsers
          heart.style.transition = `transform ${duration}s ease-in-out, opacity ${duration}s ease-in-out`;
          
          requestAnimationFrame(() => {
            heart.style.transform = 'translateY(-100vh) rotate(360deg)';
            heart.style.opacity = '0';
          });
          
          setTimeout(() => {
            this.removeHeart(heart);
          }, duration * 1000 + 1000);
        }
      } catch(e) {
        console.warn('Failed to create heart:', e);
      }
    }

    removeHeart(heart) {
      try {
        if (this.hearts && this.hearts.has(heart)) {
          this.hearts.delete(heart);
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }
      } catch(e) {
        console.warn('Failed to remove heart:', e);
      }
    }

    start() {
      if (this.isRunning || !this.container) return;
      
      try {
        this.isRunning = true;
        const intervals = [400, 500, 700];
        this.intervalIds = intervals.map(interval => 
          setInterval(this.createHeart, interval)
        );
      } catch(e) {
        console.warn('Failed to start heart animation:', e);
      }
    }

    stop() {
      if (!this.isRunning) return;
      
      try {
        this.isRunning = false;
        
        if (this.intervalIds) {
          this.intervalIds.forEach(id => clearInterval(id));
          this.intervalIds = null;
        }
        
        if (this.hearts) {
          this.hearts.forEach(heart => this.removeHeart(heart));
        }
      } catch(e) {
        console.warn('Failed to stop heart animation:', e);
      }
    }

    handleResize() {
      try {
        if (!this.hearts || !window.innerWidth) return;
        
        this.hearts.forEach(heart => {
          const currentLeft = parseFloat(heart.style.left);
          const maxLeft = window.innerWidth - this.heartWidth;
          if (currentLeft > maxLeft) {
            heart.style.left = `${Math.max(0, maxLeft)}px`;
          }
        });
      } catch(e) {
        console.warn('Failed to handle resize:', e);
      }
    }

    destroy() {
      try {
        this.stop();
        if (window.removeEventListener) {
          window.removeEventListener('resize', this.handleResize);
        }
        this.container = null;
        this.hearts = null;
      } catch(e) {
        console.warn('Failed to destroy heart manager:', e);
      }
    }
  }

  // Main Application with comprehensive error handling
  class ValentineApp {
    constructor() {
      this.heartManager = null;
      this.themeManager = null;
      this.isCardOpened = false;
      this.initialized = false;
      
      this.handleCardToggle = this.handleCardToggle.bind(this);
      this.handleKeyboard = this.handleKeyboard.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      
      this.init();
    }

    async init() {
      try {
        // Wait for DOM
        if (document.readyState === 'loading') {
          await new Promise(resolve => {
            if (document.addEventListener) {
              document.addEventListener('DOMContentLoaded', resolve);
            } else {
              // Fallback for very old browsers
              setTimeout(resolve, 100);
            }
          });
        }

        // Initialize components safely
        this.safeInitialize();
        this.initialized = true;
        
        console.log('Valentine App initialized successfully');
      } catch (error) {
        console.warn('Valentine App initialization had issues:', error);
        // Continue with partial functionality
        this.initialized = false;
      }
    }

    safeInitialize() {
      try { this.initializeThemeManager(); } catch(e) { console.warn('Theme init failed:', e); }
      try { this.initializeHeartAnimation(); } catch(e) { console.warn('Heart init failed:', e); }
      try { this.initializeCardInteraction(); } catch(e) { console.warn('Card init failed:', e); }
      try { this.initializeAccessibility(); } catch(e) { console.warn('A11y init failed:', e); }
      try { this.initializePerformanceOptimizations(); } catch(e) { console.warn('Perf init failed:', e); }
    }

    initializeThemeManager() {
      this.themeManager = new ThemeManager();
      this.addThemeToggle();
    }

    addThemeToggle() {
      // Check if toggle already exists
      if (Utils.safeQuerySelector('.theme-toggle')) return;

      try {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle dark/light theme');
        
        const currentTheme = this.themeManager.getCurrentTheme();
        toggleButton.innerHTML = `
          <span class="theme-toggle-icon">${currentTheme === 'dark' ? '☀️' : '🌙'}</span>
          <span class="sr-only">Toggle theme</span>
        `;
        
        toggleButton.addEventListener('click', () => {
          try {
            this.themeManager.toggleTheme();
          } catch(e) {
            console.warn('Theme toggle failed:', e);
          }
        });

        this.themeManager.onChange((theme) => {
          try {
            const icon = toggleButton.querySelector('.theme-toggle-icon');
            if (icon) {
              icon.textContent = theme === 'dark' ? '☀️' : '🌙';
              toggleButton.setAttribute('aria-label', 
                `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
            }
          } catch(e) {
            console.warn('Theme change update failed:', e);
          }
        });

        if (document.body) {
          document.body.appendChild(toggleButton);
        }
      } catch(e) {
        console.warn('Failed to add theme toggle:', e);
      }
    }

    initializeHeartAnimation() {
      const heartContainer = document.getElementById('heart2-container');
      if (heartContainer) {
        this.heartManager = new HeartAnimationManager('heart2-container');
        if (this.heartManager && typeof this.heartManager.start === 'function') {
          this.heartManager.start();
        }
      }
    }

    initializeCardInteraction() {
      const checkbox = document.getElementById('open');
      const cardLabel = Utils.safeQuerySelector('.open');
      
      if (checkbox && cardLabel) {
        try {
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
        } catch(e) {
          console.warn('Card interaction setup failed:', e);
        }
      }
    }

    handleCardToggle() {
      try {
        const checkbox = document.getElementById('open');
        const cardLabel = Utils.safeQuerySelector('.open');
        
        if (checkbox && checkbox.checked && !this.isCardOpened) {
          this.isCardOpened = true;
          
          if (cardLabel) {
            cardLabel.setAttribute('aria-label', 'Card opened, redirecting...');
          }
          
          this.showLoadingState();
          
          setTimeout(() => {
            this.navigateToSecondPage();
          }, 3000);
        }
      } catch(e) {
        console.warn('Card toggle failed:', e);
      }
    }

    showLoadingState() {
      try {
        const note = Utils.safeQuerySelector('.note');
        if (note) {
          note.innerHTML = `
            <div class="loading-content">
              Opening your Valentine... 
              <span class="loading-hearts">💖</span>
            </div>
          `;
        }
      } catch(e) {
        console.warn('Loading state failed:', e);
      }
    }

    navigateToSecondPage() {
      try {
        window.location.href = 'page.html';
      } catch (error) {
        console.warn('Navigation failed:', error);
        this.showError('Unable to open Valentine card. Please try refreshing the page.');
      }
    }

    initializeAccessibility() {
      this.addSkipLink();
      if (document.addEventListener) {
        document.addEventListener('keydown', this.handleKeyboard);
      }
      this.announcePageReady();
    }

    addSkipLink() {
      try {
        if (Utils.safeQuerySelector('.skip-link')) return;

        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        
        if (document.body && document.body.firstChild) {
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        
        const mainContent = Utils.safeQuerySelector('.valentines-day-card');
        if (mainContent) {
          mainContent.id = 'main-content';
          mainContent.setAttribute('role', 'main');
        }
      } catch(e) {
        console.warn('Skip link setup failed:', e);
      }
    }

    handleKeyboard(event) {
      // Future keyboard shortcuts
    }

    announcePageReady() {
      try {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'Valentine card loaded and ready to open';
        
        if (document.body) {
          document.body.appendChild(announcement);
          
          setTimeout(() => {
            if (announcement.parentNode) {
              announcement.parentNode.removeChild(announcement);
            }
          }, 1000);
        }
      } catch(e) {
        console.warn('Accessibility announcement failed:', e);
      }
    }

    initializePerformanceOptimizations() {
      if (document.addEventListener) {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
      }
      this.preloadSecondPage();
    }

    handleVisibilityChange() {
      try {
        if (document.hidden && this.heartManager && typeof this.heartManager.stop === 'function') {
          this.heartManager.stop();
        } else if (!document.hidden && this.heartManager && typeof this.heartManager.start === 'function') {
          this.heartManager.start();
        }
      } catch(e) {
        console.warn('Visibility change handling failed:', e);
      }
    }

    preloadSecondPage() {
      try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = 'page.html';
        if (document.head) {
          document.head.appendChild(link);
        }
      } catch(e) {
        console.warn('Preload failed:', e);
      }
    }

    showError(message) {
      try {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message || 'An error occurred';
        
        if (document.body) {
          document.body.appendChild(errorDiv);
          
          setTimeout(() => {
            if (errorDiv.parentNode) {
              errorDiv.parentNode.removeChild(errorDiv);
            }
          }, 5000);
        }
      } catch(e) {
        console.warn('Error display failed:', e);
      }
    }

    destroy() {
      try {
        if (this.heartManager && typeof this.heartManager.destroy === 'function') {
          this.heartManager.destroy();
        }
        
        if (document.removeEventListener) {
          document.removeEventListener('keydown', this.handleKeyboard);
          document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }
        
        this.heartManager = null;
        this.themeManager = null;
      } catch(e) {
        console.warn('App destruction failed:', e);
      }
    }
  }

  // Initialize app with error protection
  try {
    const app = new ValentineApp();
    
    // Make available globally for debugging (optional)
    if (window) {
      window.ValentineApp = app;
    }
  } catch(e) {
    console.error('Failed to initialize Valentine App:', e);
    // Ensure basic functionality still works by falling back to original behavior
    try {
      const checkbox = document.getElementById('open');
      if (checkbox) {
        checkbox.addEventListener('change', function() {
          if (checkbox.checked) {
            setTimeout(function() {
              window.location.href = 'page.html';
            }, 3000);
          }
        });
      }
    } catch(fallbackError) {
      console.error('Even fallback failed:', fallbackError);
    }
  }

})();