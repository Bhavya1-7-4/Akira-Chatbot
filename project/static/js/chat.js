// DOM Elements
const chatMessages = document.querySelector('.chat-messages');
const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const typingIndicator = document.querySelector('.typing-indicator');
const scrollBottomButton = document.querySelector('.scroll-bottom');

// State management
let isProcessingMessage = false;
let isFirstLoad = true;

// Initialize chat
document.addEventListener('DOMContentLoaded', () => {
  // Display welcome message after a short delay
  setTimeout(() => {
    displayBotMessage("Hello, I am Akira! How can I help you today?");
    isFirstLoad = false;
  }, 500);

  // Focus input
  messageInput.focus();

  // Set up event listeners
  setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
  // Send message on button click
  sendButton.addEventListener('click', sendMessage);
  
  // Send message on Enter key (but allow Shift+Enter for new lines)
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Auto-resize textarea
  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    
    // Enable/disable send button based on content
    sendButton.disabled = messageInput.value.trim() === '';
  });
  
  // Scroll detection for showing scroll button
  chatMessages.addEventListener('scroll', () => {
    const isScrolledUp = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight > 100;
    
    if (isScrolledUp) {
      scrollBottomButton.classList.add('visible');
    } else {
      scrollBottomButton.classList.remove('visible');
    }
  });
  
  // Scroll to bottom button
  scrollBottomButton.addEventListener('click', scrollToBottom);
}

// Send message to backend
async function sendMessage() {
  const message = messageInput.value.trim();
  
  // Don't send empty messages or if already processing
  if (message === '' || isProcessingMessage) return;
  
  // Display user message
  displayUserMessage(message);
  
  // Clear and reset input
  messageInput.value = '';
  messageInput.style.height = 'auto';
  sendButton.disabled = true;
  
  // Show typing indicator
  showTypingIndicator();
  
  // Set processing flag
  isProcessingMessage = true;
  
  try {
    // Send to backend
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Hide typing indicator
    hideTypingIndicator();
    
    // Display bot response with typing effect
    if (data.response) {
      displayBotMessage(data.response);
    } else if (data.error) {
      displayErrorMessage(data.error);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    hideTypingIndicator();
    displayErrorMessage('Sorry, I encountered an error processing your request. Please try again.');
  } finally {
    isProcessingMessage = false;
    messageInput.focus();
  }
}

// Display user message
function displayUserMessage(text) {
  const timeString = getCurrentTime();
  
  const messageElement = document.createElement('div');
  messageElement.className = 'message user';
  messageElement.innerHTML = `
    <div class="message-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <div class="message-content">
      <div class="message-text">${escapeHtml(text)}</div>
      <div class="message-time">${timeString}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

// Display bot message with typing effect
function displayBotMessage(text) {
  const timeString = getCurrentTime();
  
  const messageElement = document.createElement('div');
  messageElement.className = 'message bot';
  messageElement.innerHTML = `
    <div class="message-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <div class="message-content">
      <div class="message-text"></div>
      <div class="message-time">${timeString}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageElement);
  
  // Format the text with line breaks for improved readability
  const formattedText = formatBotResponse(text);
  
  // Get message text element
  const messageText = messageElement.querySelector('.message-text');
  
  // Display text with typing effect
  typeText(messageText, formattedText);
}

// Display error message
function displayErrorMessage(text) {
  const timeString = getCurrentTime();
  
  const messageElement = document.createElement('div');
  messageElement.className = 'message bot error';
  messageElement.innerHTML = `
    <div class="message-avatar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <div class="message-content">
      <div class="message-text">${escapeHtml(text)}</div>
      <div class="message-time">${timeString}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageElement);
  scrollToBottom();
}

// Format bot response to ensure line-by-line display
function formatBotResponse(text) {
  // Preserve existing line breaks
  let formattedText = text;
  
  // Split paragraphs and ensure they're separated by double line breaks
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');
  
  // Ensure lists and structured content have proper spacing
  formattedText = formattedText.replace(/([.!?])\s+/g, '$1\n');
  
  return formattedText;
}

// Type text with animation effect
function typeText(element, text, speed = 15) {
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      scrollToBottom();
    } else {
      clearInterval(timer);
    }
  }, speed);
}

// Show typing indicator
function showTypingIndicator() {
  typingIndicator.classList.add('active');
  scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
  typingIndicator.classList.remove('active');
}

// Get current time string
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Scroll to bottom of chat
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}