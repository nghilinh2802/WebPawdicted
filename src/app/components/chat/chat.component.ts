// src/app/components/chat/chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatRoom, ChatMessage } from '../../model/chat';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chatRooms$!: Observable<ChatRoom[]>;
  selectedChat: ChatRoom | null = null;
  newMessage: string = '';
  allMessages: (ChatMessage & { sender: string })[] = [];
  private chatSubscription: Subscription | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatRooms$ = this.chatService.getAllChatRooms();
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  selectChat(chat: ChatRoom): void {
    this.selectedChat = chat;
    this.loadMessages();
    
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    
    this.chatSubscription = this.chatService.getChatRoom(chat.chat_id)
      .subscribe(updatedChat => {
        if (updatedChat) {
          this.selectedChat = updatedChat;
          this.loadMessages();
        }
      });
  }

  loadMessages(): void {
    if (!this.selectedChat) return;

    this.allMessages = [
      ...this.selectedChat.customerSent.map(msg => ({ ...msg, sender: 'customer' })),
      ...this.selectedChat.pawdictedSent.map(msg => ({ ...msg, sender: 'pawdicted' }))
    ].sort((a, b) => a.time - b.time);
  }

  async sendMessage(): Promise<void> {
    if (!this.selectedChat || !this.newMessage.trim()) return;

    try {
      await this.chatService.sendPawdictedMessage(this.selectedChat.chat_id, this.newMessage);
      this.newMessage = '';
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
    }
  }

  getLastMessage(chat: ChatRoom): string {
    const allMsgs = [
      ...chat.customerSent.map(msg => ({ ...msg, sender: 'customer' })),
      ...chat.pawdictedSent.map(msg => ({ ...msg, sender: 'pawdicted' }))
    ].sort((a, b) => a.time - b.time);

    if (allMsgs.length === 0) return 'Chưa có tin nhắn';
    
    const lastMsg = allMsgs[allMsgs.length - 1];
    const prefix = lastMsg.sender === 'pawdicted' ? 'Bạn: ' : 'Khách: ';
    return prefix + lastMsg.content;
  }

  hasUnreadMessages(chat: ChatRoom): boolean {
    return chat.customerSent.length > 0;
  }
}
