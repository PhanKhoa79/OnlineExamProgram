'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle,
  Send,
  X,
  User,
  Bot,
  Clock,
  Minimize2,
  Maximize2,
  Smile
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useChatbot } from '@/features/chatbot/hooks/useChatbot';
import SuggestionChips from '@/features/chatbot/components/SuggestionChips';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export default function ChatWidget({ isOpen, onClose, onMinimize, isMinimized }: ChatWidgetProps) {
  const { user } = useAuthStore();
  const { 
    messages, 
    isTyping, 
    isConnected, 
    sendMessage, 
    handleSuggestionClick 
  } = useChatbot();
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    sendMessage(newMessage.trim());
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent': return <span className="text-gray-400">✓</span>;
      case 'delivered': return <span className="text-blue-500">✓✓</span>;
      case 'read': return <span className="text-blue-600">✓✓</span>;
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-20 z-50">
      <div className={`w-96 bg-white dark:bg-gray-800 shadow-2xl rounded-lg transition-all duration-300 flex flex-col ${isMinimized ? 'h-14' : 'h-124'}`}>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Trợ lý AI</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onMinimize && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20 p-1 h-auto"
                  onClick={onMinimize}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20 p-1 h-auto"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages - CHỈ CÓ MỘT THANH CUỘN DUY NHẤT */}
        {!isMinimized && (
          <>
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-green-500'
                      }`}>
                        {message.sender === 'user' ? (
                          user?.accountname?.[0]?.toUpperCase() || <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border'
                      }`}>
                        <div className="text-sm">{message.content}</div>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.sender === 'user' && getStatusIcon(message.status)}
                        </div>
                        
                        {/* Suggestion chips for bot messages */}
                        {message.sender === 'bot' && message.suggestions && (
                          <SuggestionChips
                            suggestions={message.suggestions}
                            onSuggestionClick={handleSuggestionClick}
                            disabled={isTyping}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white dark:bg-gray-800 rounded-b-lg flex-shrink-0 relative">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected}
                  className="flex-1 text-sm"
                />
                
                {/* Emoji Button */}
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="px-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={!isConnected}
                >
                  <Smile className="w-4 h-4" />
                </Button>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-0 mb-2 z-10"
                >
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    set="native"
                    locale="vi"
                    previewPosition="none"
                    skinTonePosition="none"
                    maxFrequentRows={4}
                    maxRecentRows={4}
                  />
                </div>
              )}
              
              {!isConnected && (
                <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Mất kết nối. Đang thử kết nối lại...
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 