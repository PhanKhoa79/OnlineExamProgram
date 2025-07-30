/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatbotMessage, SuggestionChip, ChatbotResponse } from '../types/chatbot';

class ChatbotService {
  private readonly apiUrl = '/api/dialogflow'; 

  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryText: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to chatbot API');
      }

      const data = await response.json();
      return data as ChatbotResponse;
    } catch (error) {
      throw new Error('Không thể kết nối với chatbot. Vui lòng thử lại sau.');
    }
  }

  async getWelcomeMessage(): Promise<ChatbotResponse> {
    return this.sendMessage('xin chào');
  }

  parseChatbotResponse(response: ChatbotResponse): {
    messages: string[];
    suggestions: SuggestionChip[];
  } {
    const messages: string[] = [];
    const suggestions: SuggestionChip[] = [];

    // Xử lý fulfillmentMessages
    response.fulfillmentMessages?.forEach(message => {
      // Xử lý tin nhắn text
      if (message.text?.text) {
        messages.push(...message.text.text);
      }

      // Xử lý richContent (suggestion chips)
      if (message.payload?.fields?.richContent?.listValue?.values) {
        message.payload.fields.richContent.listValue.values.forEach(contentArray => {
          if (contentArray.listValue?.values) {
            contentArray.listValue.values.forEach(content => {
              if (content.structValue?.fields?.type?.stringValue === 'chips' && content.structValue?.fields?.options?.listValue?.values) {
                content.structValue.fields.options.listValue.values.forEach(option => {
                  const chip = option.structValue?.fields;
                  if (chip) {
                    const suggestion: SuggestionChip = {
                      text: chip.text?.stringValue || '',
                      link: chip.link?.stringValue || '',
                      image: chip.image?.structValue?.fields?.src?.structValue?.fields?.rawUrl?.stringValue
                        ? { src: { rawUrl: chip.image.structValue.fields.src.structValue.fields.rawUrl.stringValue } }
                        : undefined,
                    };
                    suggestions.push(suggestion);
                  }
                });
              }
            });
          }
        });
      }
    });

    return { messages, suggestions };
  }
}

export const chatbotService = new ChatbotService();
export type { ChatbotMessage, SuggestionChip, ChatbotResponse };