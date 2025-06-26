import { Timestamp } from 'firebase/firestore'; 

export interface Promotion {
  id?: string; 
  title: string;
  description: string;
  time: Timestamp; 
  imageUrl: string; 
  status?: 'scheduled' | 'sent'; 
}