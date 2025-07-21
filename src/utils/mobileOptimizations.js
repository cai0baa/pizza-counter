// Mobile-specific optimizations for better performance and battery life

// Detect if user prefers reduced motion for accessibility and battery life
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimized animation classes based on device capabilities
export const getAnimationClass = (animationType = 'bounce') => {
  const reduced = prefersReducedMotion();
  
  const animations = {
    bounce: reduced ? '' : 'animate-bounce',
    pulse: reduced ? '' : 'animate-pulse',
    scale: reduced ? '' : 'hover:scale-105',
    transform: reduced ? 'transition-none' : 'transition-transform'
  };
  
  return animations[animationType] || '';
};

// Debounce function for touch events to prevent excessive updates
export const debounce = (func, wait = 100) => {
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

// Throttle function for scroll or resize events
export const throttle = (func, delay = 16) => { // 60fps = 16ms
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Check if device has low memory or is low-end
export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for device memory hint
  if ('deviceMemory' in navigator) {
    return navigator.deviceMemory < 4; // Less than 4GB RAM
  }
  
  // Fallback: check hardware concurrency
  if ('hardwareConcurrency' in navigator) {
    return navigator.hardwareConcurrency < 4; // Less than 4 cores
  }
  
  return false;
};

// Get optimal batch size for rendering based on device
export const getOptimalBatchSize = () => {
  const lowEnd = isLowEndDevice();
  return lowEnd ? 10 : 20; // Render fewer items at once on low-end devices
};

// Check if device supports touch
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Optimized requestAnimationFrame for mobile
export const optimizedRAF = (callback) => {
  if (prefersReducedMotion() || isLowEndDevice()) {
    // Skip animation on low-end devices or when motion is reduced
    return setTimeout(callback, 16);
  }
  return requestAnimationFrame(callback);
};