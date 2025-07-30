export interface ChatbotMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  suggestions?: SuggestionChip[];
}

export interface SuggestionChip {
  text: string;
  link?: string;
  image?: { src: { rawUrl: string } };
}

export interface ChatbotResponse {
  fulfillmentMessages?: {
    platform?: string;
    text?: { text: string[] };
    payload?: {
      fields?: {
        richContent?: {
          listValue?: {
            values?: {
              listValue?: {
                values?: {
                  structValue?: {
                    fields?: {
                      type?: { stringValue: string };
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      options?: { listValue?: { values?: any[] } };
                    };
                  };
                }[];
              };
            }[];
          };
        };
      };
    };
    message?: string;
  }[];
  intent?: { displayName?: string };
}