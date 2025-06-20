
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Blog } from '../model/blogs.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseBlogsService {
  private collectionPath = 'blogs';

  constructor(private firestore: Firestore) {}

  getBlogs(): Observable<Blog[]> {
    const blogsRef = collection(this.firestore, this.collectionPath);
    return collectionData(blogsRef, { idField: 'id' }) as Observable<Blog[]>;
  }

  async addBlog(blog: Blog): Promise<void> {
    const id = this.generateId();
    const now = new Date().toISOString();
    const blogWithMeta = { ...blog, id, createdAt: now, updatedAt: now };
    const docRef = doc(this.firestore, `${this.collectionPath}/${id}`);
    await setDoc(docRef, blogWithMeta);
  }

  async updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${id}`);
    await updateDoc(docRef, { ...blog, updatedAt: new Date().toISOString() });
  }

  async deleteBlog(id: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionPath}/${id}`);
    await deleteDoc(docRef);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}
