'use client'; 

import { useState, useEffect, useCallback } from 'react';
import { chatbotService } from '../services/chatbotService';
import { ChatbotMessage, SuggestionChip } from '../types/chatbot';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected] = useState(true);
  const [suggestions, setSuggestions] = useState<SuggestionChip[]>([]);
  const [hasLoadedWelcome, setHasLoadedWelcome] = useState(false);

  useEffect(() => {
    if (messages.length === 0 && !hasLoadedWelcome) {
      const initializeChat = async () => {
        try {
          setIsTyping(true);
          const response = await chatbotService.getWelcomeMessage();
          const { messages: welcomeMessages, suggestions: welcomeSuggestions } = chatbotService.parseChatbotResponse(response);

          const welcomeMessage: ChatbotMessage = {
            id: Date.now().toString(),
            content: welcomeMessages.join('\n'),
            sender: 'bot',
            timestamp: new Date(),
            status: 'read',
            suggestions: welcomeSuggestions,
          };

          setMessages([welcomeMessage]);
          setSuggestions(welcomeSuggestions);
          setHasLoadedWelcome(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setHasLoadedWelcome(true);
        } finally {
          setIsTyping(false);
        }
      };

      initializeChat();
    }
  }, [messages.length, hasLoadedWelcome]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg))
        );
      }, 500);

      const response = await chatbotService.sendMessage(content);
      const { messages: botMessages, suggestions: botSuggestions } = chatbotService.parseChatbotResponse(response);

      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        content: botMessages.join('\n'),
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
        suggestions: botSuggestions,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setSuggestions(botSuggestions);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Xin lỗi, tôi không thể kết nối với server. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestion: SuggestionChip) => {
      sendMessage(suggestion.text);
    },
    [sendMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setHasLoadedWelcome(false);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setHasLoadedWelcome(false);
  }, []);

  return {
    messages,
    isTyping,
    isConnected,
    suggestions,
    sendMessage,
    handleSuggestionClick,
    clearMessages,
    resetChat,
  };
};