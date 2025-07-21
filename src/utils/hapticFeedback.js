// Haptic feedback utilities for mobile interactions

// Check if haptic feedback is supported
const isHapticSupported = () => {
  return 'vibrate' in navigator;
};

// Check if advanced haptic feedback is supported (iOS)
const isAdvancedHapticSupported = () => {
  return 'vibrate' in navigator && 
         'userAgent' in navigator && 
         /iPhone|iPad|iPod/.test(navigator.userAgent);
};

// Haptic feedback patterns (duration in milliseconds)
export const HAPTIC_PATTERNS = {
  // Light feedback for button taps
  light: [10],
  
  // Medium feedback for increments/decrements  
  medium: [25],
  
  // Strong feedback for important actions
  strong: [50],
  
  // Success pattern (3 light pulses)
  success: [10, 50, 10, 50, 10],
  
  // Error pattern (2 strong pulses)
  error: [100, 100, 100],
  
  // Achievement pattern (celebration)
  achievement: [25, 50, 25, 50, 100, 50, 25],
  
  // Warning pattern (single long pulse)
  warning: [200],
  
  // Tick pattern for counter changes
  tick: [5]
};

// Main haptic feedback function
export const triggerHaptic = (pattern = 'light') => {
  // Don't trigger haptic in non-browser environments
  if (typeof window === 'undefined') return;
  
  // Check if device supports haptic feedback
  if (!isHapticSupported()) return;
  
  // Get pattern array
  const hapticPattern = HAPTIC_PATTERNS[pattern] || HAPTIC_PATTERNS.light;
  
  try {
    // Use vibration API
    navigator.vibrate(hapticPattern);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

// Specific haptic functions for different interactions
export const hapticFeedback = {
  // Button press feedback
  buttonTap: () => triggerHaptic('light'),
  
  // Counter increment/decrement
  counterChange: () => triggerHaptic('medium'),
  
  // Important actions (add/remove participant)
  importantAction: () => triggerHaptic('strong'),
  
  // Success feedback (participant added, export completed)
  success: () => triggerHaptic('success'),
  
  // Error feedback (validation failed, action blocked)
  error: () => triggerHaptic('error'),
  
  // Achievement feedback (new leader, milestone reached)
  achievement: () => triggerHaptic('achievement'),
  
  // Warning feedback (approaching limits)
  warning: () => triggerHaptic('warning'),
  
  // Subtle tick for real-time updates
  tick: () => triggerHaptic('tick')
};

// React hook for haptic feedback with settings integration
export const useHapticFeedback = (settings = { enableHapticFeedback: true }) => {
  const triggerIfEnabled = (feedbackType) => {
    if (settings.enableHapticFeedback && isHapticSupported()) {
      hapticFeedback[feedbackType]?.();
    }
  };

  return {
    // Wrapped haptic functions that respect user settings
    buttonTap: () => triggerIfEnabled('buttonTap'),
    counterChange: () => triggerIfEnabled('counterChange'),
    importantAction: () => triggerIfEnabled('importantAction'),
    success: () => triggerIfEnabled('success'),
    error: () => triggerIfEnabled('error'),
    achievement: () => triggerIfEnabled('achievement'),
    warning: () => triggerIfEnabled('warning'),
    tick: () => triggerIfEnabled('tick'),
    
    // Utility info
    isSupported: isHapticSupported(),
    isAdvancedSupported: isAdvancedHapticSupported(),
    isEnabled: settings.enableHapticFeedback
  };
};

// Haptic feedback for specific pizza counter actions
export const pizzaHaptics = {
  // When incrementing pizza count
  sliceAdded: () => hapticFeedback.counterChange(),
  
  // When decrementing pizza count  
  sliceRemoved: () => hapticFeedback.counterChange(),
  
  // When someone takes the lead
  newLeader: () => hapticFeedback.achievement(),
  
  // When reaching milestones (5, 10, 15, 20+ slices)
  milestone: (count) => {
    if (count % 5 === 0 && count >= 5) {
      hapticFeedback.achievement();
    } else {
      hapticFeedback.tick();
    }
  },
  
  // When hitting maximum slices
  maxReached: () => hapticFeedback.warning(),
  
  // When adding a participant
  participantAdded: () => hapticFeedback.success(),
  
  // When removing a participant
  participantRemoved: () => hapticFeedback.importantAction(),
  
  // When toggling penalty
  penaltyToggled: () => hapticFeedback.warning(),
  
  // When exporting results
  exportCompleted: () => hapticFeedback.success(),
  
  // When validation fails
  validationError: () => hapticFeedback.error(),
  
  // Important actions (reset, clear all)
  importantAction: () => hapticFeedback.importantAction(),
  
  // Success actions (save, confirm)
  success: () => hapticFeedback.success(),
  
  // Error actions
  error: () => hapticFeedback.error()
};