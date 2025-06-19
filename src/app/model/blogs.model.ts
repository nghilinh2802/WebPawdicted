export interface Blog {
  id: number;
  title: string;
  content: string;
  description: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
}