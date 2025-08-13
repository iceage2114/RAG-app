// messageUtils.js - Utility functions for message styling and logic

/**
 * Get the appropriate CSS class for a message based on sender
 * @param {string} sender - The sender of the message ('user' or 'bot')
 * @param {boolean} isLoading - Whether this is a loading message
 * @returns {string} - The CSS class name
 */
export const getMessageClassName = (sender, isLoading = false) => {
  const baseClass = sender === 'user' ? 'user-message' : 'bot-message';
  const loadingClass = isLoading ? 'loading-message' : '';
  
  return `message ${baseClass} ${loadingClass}`.trim();
};

/**
 * Create a typing indicator component
 * @returns {JSX.Element} - The typing indicator JSX
 */
export const createTypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

/**
 * Create a loading message object
 * @param {string} text - The loading message text
 * @returns {Object} - Message object for loading state
 */
export const createLoadingMessage = (text = "AI is thinking...") => {
  return {
    sender: "bot",
    text: text,
    isLoading: true,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create a bot message object
 * @param {string} text - The bot message text
 * @returns {Object} - Message object for bot response
 */
export const createBotMessage = (text) => {
  return {
    sender: "bot",
    text: text,
    isLoading: false,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create a user message object
 * @param {string} text - The user message text
 * @returns {Object} - Message object for user message
 */
export const createUserMessage = (text) => {
  return {
    sender: "user",
    text: text,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format messages for OpenAI API
 * @param {Array} messages - Array of message objects
 * @returns {Array} - Formatted messages for OpenAI
 */
export const formatMessagesForAI = (messages) => {
  return messages
    .filter(msg => !msg.isLoading) // Remove loading messages
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
};

/**
 * Get error message for failed API calls
 * @returns {Object} - Error message object
 */
export const createErrorMessage = () => {
  return createBotMessage("Sorry, I'm having trouble responding right now. Please try again.");
};

// Message type constants
export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  LOADING: 'loading',
  ERROR: 'error'
};

// Default placeholders
export const PLACEHOLDERS = {
  CHAT_INPUT: "Ask me about car repairs, maintenance, or any automotive questions...",
  NO_CONVERSATION: "Select a conversation to start chatting with AI assistant",
  LOADING_TEXT: "AI is thinking..."
};