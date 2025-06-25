// src/app/services/chat.service.ts
import { Injectable, inject, runInInjectionContext, Injector } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, updateDoc, setDoc, getDoc, arrayUnion, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatMessage, ChatRoom } from '../model/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private customerNamesCache = new Map<string, string>();
  private customerNamesSubject = new BehaviorSubject<Map<string, string>>(new Map());
  public customerNames$ = this.customerNamesSubject.asObservable();
  private injector = inject(Injector);
  private isLoadingNames = new Set<string>();

  constructor(private firestore: Firestore) {}

  // Fix type casting issue
  getAllChatRooms(): Observable<ChatRoom[]> {
    const chatsRef = collection(this.firestore, 'chats');
    return collectionData(chatsRef, { idField: 'id' }).pipe(
      map((chats: any[]) => { // Use any[] first
        // Cast to ChatRoom[] and filter valid data
        const validChats = chats
          .filter(chat => chat && chat.chat_id && chat.customer_id)
          .map(chat => ({
            chat_id: chat.chat_id || chat.id,
            customer_id: chat.customer_id,
            customerSent: chat.customerSent || [],
            pawdictedSent: chat.pawdictedSent || []
          } as ChatRoom));

        // Sort: unreplied first, then by time
        return validChats.sort((a, b) => {
          const isUnrepliedA = this.isUnrepliedMessage(a);
          const isUnrepliedB = this.isUnrepliedMessage(b);
          
          if (isUnrepliedA && !isUnrepliedB) return -1;
          if (!isUnrepliedA && isUnrepliedB) return 1;
          
          const lastTimeA = this.getLastMessageTime(a);
          const lastTimeB = this.getLastMessageTime(b);
          return lastTimeB - lastTimeA;
        });
      })
    );
  }

  getChatRoom(chatId: string): Observable<ChatRoom | undefined> {
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return docData(chatRef).pipe(
      map((data: any) => {
        if (!data) return undefined;
        return {
          chat_id: data.chat_id || chatId,
          customer_id: data.customer_id,
          customerSent: data.customerSent || [],
          pawdictedSent: data.pawdictedSent || []
        } as ChatRoom;
      })
    );
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

  // Kiểm tra tin nhắn chưa được trả lời
  isUnrepliedMessage(chat: ChatRoom): boolean {
    if (!chat.customerSent || chat.customerSent.length === 0) return false;
    if (!chat.pawdictedSent || chat.pawdictedSent.length === 0) return true;
    
    const lastCustomerMsg = Math.max(...chat.customerSent.map(msg => msg.time));
    const lastPawdictedMsg = Math.max(...chat.pawdictedSent.map(msg => msg.time));
    
    return lastCustomerMsg > lastPawdictedMsg;
  }

  async getCustomerName(customerId: string): Promise<string> {
    if (this.isLoadingNames.has(customerId)) {
      return this.getCachedCustomerName(customerId);
    }

    if (this.customerNamesCache.has(customerId)) {
      return this.customerNamesCache.get(customerId)!;
    }

    if (customerId.startsWith('guest_')) {
      const guestName = 'Khách vãng lai';
      this.customerNamesCache.set(customerId, guestName);
      this.updateCustomerNamesSubject();
      return guestName;
    }

    this.isLoadingNames.add(customerId);

    try {
      return await runInInjectionContext(this.injector, async () => {
        const customersRef = collection(this.firestore, 'customers');
        const q = query(customersRef, where('customer_id', '==', customerId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const customerDoc = querySnapshot.docs[0];
          const customerData = customerDoc.data();
          const customerName = customerData['customer_name'] || customerData['customer_username'] || `Khách hàng ${customerId.substring(0, 6)}`;
          
          this.customerNamesCache.set(customerId, customerName);
          this.updateCustomerNamesSubject();
          
          return customerName;
        } else {
          const fallbackName = `Khách hàng ${customerId.substring(0, 6)}`;
          this.customerNamesCache.set(customerId, fallbackName);
          this.updateCustomerNamesSubject();
          return fallbackName;
        }
      });
    } catch (error) {
      console.error('Error fetching customer name:', error);
      const errorName = `Khách hàng ${customerId.substring(0, 6)}`;
      this.customerNamesCache.set(customerId, errorName);
      this.updateCustomerNamesSubject();
      return errorName;
    } finally {
      this.isLoadingNames.delete(customerId);
    }
  }

  async loadCustomerNames(customerIds: string[]): Promise<void> {
    const uncachedIds = customerIds.filter(id => 
      !this.customerNamesCache.has(id) && !this.isLoadingNames.has(id)
    );
    
    if (uncachedIds.length === 0) return;

    try {
      await Promise.all(uncachedIds.map(id => this.getCustomerName(id)));
    } catch (error) {
      console.error('Error loading customer names:', error);
    }
  }

  private updateCustomerNamesSubject(): void {
    this.customerNamesSubject.next(new Map(this.customerNamesCache));
  }

  getCachedCustomerName(customerId: string): string {
    if (customerId.startsWith('guest_')) {
      return 'Khách vãng lai';
    }
    return this.customerNamesCache.get(customerId) || `Khách hàng ${customerId.substring(0, 6)}`;
  }

  clearCustomerNamesCache(): void {
    this.customerNamesCache.clear();
    this.isLoadingNames.clear();
    this.updateCustomerNamesSubject();
  }

  isCustomerOnline(chat: ChatRoom): boolean {
    const lastMessageTime = this.getLastMessageTime(chat);
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    return lastMessageTime > fiveMinutesAgo;
  }

  getLastMessageTime(chat: ChatRoom): number {
    const customerTimes = (chat.customerSent || []).map(msg => msg.time);
    const pawdictedTimes = (chat.pawdictedSent || []).map(msg => msg.time);
    const allTimes = [...customerTimes, ...pawdictedTimes];

    if (allTimes.length === 0) return 0;
    return Math.max(...allTimes);
  }

  getUnreadCount(chat: ChatRoom): number {
    return (chat.customerSent || []).length;
  }

  getLastMessage(chat: ChatRoom): string {
    const customerMsgs = (chat.customerSent || []).map(msg => ({ ...msg, sender: 'customer' }));
    const pawdictedMsgs = (chat.pawdictedSent || []).map(msg => ({ ...msg, sender: 'pawdicted' }));
    const allMsgs = [...customerMsgs, ...pawdictedMsgs].sort((a, b) => a.time - b.time);

    if (allMsgs.length === 0) return 'Chưa có tin nhắn';
    
    const lastMsg = allMsgs[allMsgs.length - 1];
    const prefix = lastMsg.sender === 'pawdicted' ? 'Bạn: ' : 'Khách: ';
    return prefix + lastMsg.content;
  }
}
