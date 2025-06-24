// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, updateDoc, setDoc, getDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatMessage, ChatRoom } from '../model/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: Firestore) {}

  getAllChatRooms(): Observable<ChatRoom[]> {
    const chatsRef = collection(this.firestore, 'chats');
    return collectionData(chatsRef, { idField: 'id' }) as Observable<ChatRoom[]>;
  }

  getChatRoom(chatId: string): Observable<ChatRoom | undefined> {
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return docData(chatRef) as Observable<ChatRoom | undefined>;
  }

  async sendPawdictedMessage(chatId: string, content: string): Promise<void> {
    const message: ChatMessage = {
      content: content,
      time: Date.now()
    };

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    
    try {
      await updateDoc(chatRef, {
        pawdictedSent: arrayUnion(message)
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async createChatRoom(customerId: string): Promise<void> {
    // Tạo ID tự động
    const chatId = doc(collection(this.firestore, 'chats')).id;
    
    const newChat: ChatRoom = {
      chat_id: chatId,
      customer_id: customerId,
      customerSent: [],
      pawdictedSent: []
    };

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    await setDoc(chatRef, newChat);
  }
}
