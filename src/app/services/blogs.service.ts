import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from '../model/blogs.model';
import { DatabaseBlogsService } from './database-blogs.service';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  constructor(private db: DatabaseBlogsService) {}

  getBlogs(): Observable<Blog[]> {
    return this.db.getBlogs();
  }

  addBlog(blog: Blog): Promise<void> {
    return this.db.addBlog(blog);
  }

  updateBlog(id: string, blog: Blog): Promise<void> {
    return this.db.updateBlog(id, blog);
  }

  deleteBlog(id: string): Promise<void> {
    return this.db.deleteBlog(id);
  }
}
