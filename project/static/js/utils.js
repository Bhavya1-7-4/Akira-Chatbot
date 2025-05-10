/**
 * Utility functions for the Akira chatbot interface
 */

// Detect user inactivity
export function setupInactivityDetection(callback, timeoutMinutes = 30) {
  let inactivityTimer;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  
  // Reset timer on user activity
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      callback();
    }, timeoutMs);
  };
  
  // Track user activity events
  const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
  activityEvents.forEach(event => {
    document.addEventListener(event, resetTimer, { passive: true });
  });
  
  // Initial timer start
  resetTimer();
  
  // Return function to clear all listeners
  return () => {
    clearTimeout(inactivityTimer);
    activityEvents.forEach(event => {
      document.removeEventListener(event, resetTimer);
    });
  };
}

// Detect if the user is on a mobile device
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Speech synthesis (text-to-speech)
export function speakText(text, options = {}) {
  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    return false;
  }
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set options
  utterance.lang = options.lang || 'en-US';
  utterance.volume = options.volume || 1;
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
  
  return {
    cancel: () => window.speechSynthesis.cancel(),
    pause: () => window.speechSynthesis.pause(),
    resume: () => window.speechSynthesis.resume(),
    isPaused: () => window.speechSynthesis.paused,
    isSpeaking: () => window.speechSynthesis.speaking
  };
}

// Format dates and times in a user-friendly way
export function formatDateTime(date) {
  const now = new Date();
  const messageDate = new Date(date);
  
  // Check if the message is from today
  if (messageDate.toDateString() === now.toDateString()) {
    return formatTime(messageDate);
  }
  
  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${formatTime(messageDate)}`;
  }
  
  // Otherwise return the date and time
  return `${messageDate.toLocaleDateString()} ${formatTime(messageDate)}`;
}

// Format time in 12-hour format with AM/PM
export function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${hours}:${minutes} ${ampm}`;
}

// Debounce function to limit the rate at which a function can fire
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Local storage helper functions
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};