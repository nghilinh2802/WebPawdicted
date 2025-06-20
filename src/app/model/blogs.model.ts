export interface Blog {
  id: string;
  title: string;
  content: string;
  description: string;
  author?: string;
  imageURL: string;
  createdAt?: Date;
  updatedAt?: Date;
}