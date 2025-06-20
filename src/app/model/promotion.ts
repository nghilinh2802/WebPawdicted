export interface Promotion {
  id?: string; 
  title: string;
  description: string;
  time: string; 
  imageUrl: string; 
  status?: 'scheduled' | 'sent'; 
}