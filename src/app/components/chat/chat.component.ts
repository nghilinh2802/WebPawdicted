// src/app/components/chat/chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatRoom, ChatMessage } from '../../model/chat';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chatRooms$!: Observable<ChatRoom[]>;
  selectedChatRoom: ChatRoom | null = null;
  currentChatMessages: (ChatMessage & { sender: string })[] = [];
  newMessage: string = '';
  
  private chatSubscription: Subscription | null = null;
  private customerNamesSubscription: Subscription | null = null;
  
  isSending: boolean = false;
  isLoading: boolean = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadChatRooms();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  loadChatRooms(): void {
    this.isLoading = true;
    this.chatRooms$ = this.chatService.getAllChatRooms();
    
    this.customerNamesSubscription = this.chatService.customerNames$.subscribe();

    this.chatRooms$.subscribe(chats => {
      this.isLoading = false;
      if (chats && chats.length > 0) {
        const customerIds = chats.map(chat => chat.customer_id);
        this.chatService.loadCustomerNames(customerIds);
      }
    });
  }

  openChatModal(chatRoom: ChatRoom): void {
    this.selectedChatRoom = chatRoom;
    this.loadChatMessages();
    
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    
    this.chatSubscription = this.chatService.getChatRoom(chatRoom.chat_id)
      .subscribe(updatedChat => {
        if (updatedChat && this.selectedChatRoom?.chat_id === updatedChat.chat_id) {
          this.selectedChatRoom = updatedChat;
          this.loadChatMessages();
          this.scrollToBottom();
        }
      });
  }

  closeChatModal(): void {
    this.selectedChatRoom = null;
    this.currentChatMessages = [];
    this.newMessage = '';
    
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
      this.chatSubscription = null;
    }
  }

  loadChatMessages(): void {
    if (!this.selectedChatRoom) return;

    this.currentChatMessages = [
      ...this.selectedChatRoom.customerSent.map(msg => ({ ...msg, sender: 'customer' })),
      ...this.selectedChatRoom.pawdictedSent.map(msg => ({ ...msg, sender: 'pawdicted' }))
    ].sort((a, b) => a.time - b.time);
  }

  async sendMessage(): Promise<void> {
    if (!this.selectedChatRoom || !this.newMessage.trim() || this.isSending) return;

    this.isSending = true;
    const messageToSend = this.newMessage.trim();
    this.newMessage = '';

    try {
      await this.chatService.sendPawdictedMessage(this.selectedChatRoom.chat_id, messageToSend);
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      this.newMessage = messageToSend;
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      this.isSending = false;
    }
  }

  private cleanup(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    if (this.customerNamesSubscription) {
      this.customerNamesSubscription.unsubscribe();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.modal-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  getCustomerDisplayName(chat: ChatRoom): string {
    return this.chatService.getCachedCustomerName(chat.customer_id);
  }

  getCustomerInitials(chat: ChatRoom): string {
    const displayName = this.getCustomerDisplayName(chat);
    if (displayName === 'Khách vãng lai') return 'KV';
    if (displayName.startsWith('Khách hàng')) return 'KH';
    
    const words = displayName.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  }

  isCustomerOnline(chat: ChatRoom): boolean {
    return this.chatService.isCustomerOnline(chat);
  }

  getUnreadCount(chat: ChatRoom): number {
    return this.chatService.getUnreadCount(chat);
  }

  getLastMessageTime(chat: ChatRoom): number {
    return this.chatService.getLastMessageTime(chat);
  }

  getLastMessage(chat: ChatRoom): string {
    return this.chatService.getLastMessage(chat);
  }

  hasUnreadMessages(chat: ChatRoom): boolean {
    return this.getUnreadCount(chat) > 0;
  }

  // Kiểm tra tin nhắn chưa được trả lời
  isUnrepliedMessage(chat: ChatRoom): boolean {
    return this.chatService.isUnrepliedMessage(chat);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  trackByCustomerId(index: number, chat: ChatRoom): string {
    return chat.customer_id;
  }

  trackByMessageTime(index: number, message: ChatMessage & { sender: string }): number {
    return message.time;
  }
}
