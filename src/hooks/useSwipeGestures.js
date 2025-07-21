import { useState, useEffect, useRef, useCallback } from 'react';

// Configuration for swipe detection
const SWIPE_CONFIG = {
  minDistance: 50,        // Minimum distance for a swipe (pixels)
  maxTime: 500,          // Maximum time for a swipe (ms)
  preventScroll: true,   // Prevent scroll when swiping
  threshold: 0.3,        // Velocity threshold for swipe detection
  touchSlop: 10          // Touch slop for avoiding accidental swipes
};

export default function useSwipeGestures({
  onSwipeUp,
  onSwipeDown,  
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
  config = SWIPE_CONFIG
}) {
  const [isSwiping, setIsSwiping] = useState(false);
  const touchRef = useRef(null);
  const swipeStateRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    isTracking: false,
    initialDirection: null
  });

  const handleTouchStart = useCallback((e) => {
    if (!enabled) return;

    const touch = e.touches[0];
    if (!touch) return;

    swipeStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isTracking: true,
      initialDirection: null
    };

    setIsSwiping(false);
  }, [enabled]);

  const handleTouchMove = useCallback((e) => {
    if (!enabled || !swipeStateRef.current.isTracking) return;

    const touch = e.touches[0];
    if (!touch) return;

    const { startX, startY, touchSlop } = swipeStateRef.current;
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    // Determine initial swipe direction to prevent scrolling conflicts
    if (!swipeStateRef.current.initialDirection) {
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > touchSlop || absDeltaY > touchSlop) {
        swipeStateRef.current.initialDirection = absDeltaX > absDeltaY ? 'horizontal' : 'vertical';
        
        // Prevent scroll if horizontal swipe and configured to do so
        if (config.preventScroll && swipeStateRef.current.initialDirection === 'horizontal') {
          setIsSwiping(true);
        }
      }
    }

    // Prevent scrolling during horizontal swipes
    if (config.preventScroll && 
        swipeStateRef.current.initialDirection === 'horizontal' && 
        isSwiping) {
      e.preventDefault();
    }
  }, [enabled, config.preventScroll, isSwiping]);

  const handleTouchEnd = useCallback((e) => {
    if (!enabled || !swipeStateRef.current.isTracking) return;

    const endTime = Date.now();
    const { startX, startY, startTime } = swipeStateRef.current;
    const touch = e.changedTouches[0];
    
    if (!touch) {
      swipeStateRef.current.isTracking = false;
      setIsSwiping(false);
      return;
    }

    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Reset state
    swipeStateRef.current.isTracking = false;
    setIsSwiping(false);

    // Check if swipe meets criteria
    const isValidSwipe = 
      distance >= config.minDistance &&
      deltaTime <= config.maxTime &&
      velocity >= config.threshold;

    if (!isValidSwipe) return;

    // Determine swipe direction and trigger appropriate callback
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight({ deltaX, deltaY, distance, velocity, duration: deltaTime });
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft({ deltaX, deltaY, distance, velocity, duration: deltaTime });
      }
    } else {
      // Vertical swipe  
      if (deltaY < 0 && onSwipeUp) {
        onSwipeUp({ deltaX, deltaY, distance, velocity, duration: deltaTime });
      } else if (deltaY > 0 && onSwipeDown) {
        onSwipeDown({ deltaX, deltaY, distance, velocity, duration: deltaTime });
      }
    }
  }, [enabled, config, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight]);

  // Set up touch event listeners
  useEffect(() => {
    const element = touchRef.current;
    if (!element) return;

    const options = { passive: false };

    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    touchRef,
    isSwiping,
    isEnabled: enabled
  };
}

// Specialized hook for pizza counter swipe gestures
export function usePizzaSwipeGestures({ onIncrement, onDecrement, enabled = true }) {
  return useSwipeGestures({
    onSwipeUp: onIncrement,
    onSwipeRight: onIncrement,
    onSwipeDown: onDecrement,
    onSwipeLeft: onDecrement,
    enabled,
    config: {
      ...SWIPE_CONFIG,
      minDistance: 30,     // Shorter distance for counter gestures
      maxTime: 400,        // Faster response for counter
      threshold: 0.2       // Lower threshold for easier triggering
    }
  });
}