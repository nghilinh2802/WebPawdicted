// src/app/models/chat.model.ts
export interface ChatMessage {
  content: string;
  time: number;
}

export interface ChatRoom {
  chat_id: string;        
  customer_id: string;    
  customerSent: ChatMessage[];
  pawdictedSent: ChatMessage[];
}
