import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DatabaseService } from './database.service';
import { Blog } from '../model/blogs.model';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  private blogsPath = 'blogs';

  constructor(private databaseService: DatabaseService) {}

  // Lấy danh sách blog
  getBlogs(): Observable<Blog[]> {
    return this.databaseService.listenData(this.blogsPath).pipe(
      map(blogsData => {
        if (blogsData) {
          return Object.keys(blogsData).map(key => ({
            id: key,
            ...blogsData[key]
          }));
        }
        return [];
      })
    );
  }

  // Thêm blog mới
  async addBlog(blog: Blog): Promise<void> {
    const blogId = this.generateId();
    const blogWithId = { ...blog, id: blogId };
    await this.databaseService.writeData(`${this.blogsPath}/${blogId}`, blogWithId);
  }

  // Sửa blog
  async updateBlog(id: string, blog: Blog): Promise<void> {
    await this.databaseService.writeData(`${this.blogsPath}/${id}`, blog);
  }

  // Xóa blog
  async deleteBlog(id: string): Promise<void> {
    await this.databaseService.writeData(`${this.blogsPath}/${id}`, null);
  }

  // Tạo ID unique
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
