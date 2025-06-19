import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  // Thay URL này bằng API endpoint thực tế của bạn
  private apiUrl = 'http://localhost:3000/api/blogs'; // Ví dụ

  constructor(private http: HttpClient) { }

  // Lấy danh sách blog
  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Thêm blog mới (nếu cần)
  addBlog(blog: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, blog);
  }

  // Sửa blog (nếu cần)
  updateBlog(id: number, blog: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, blog);
  }

  // Xóa blog (nếu cần)
  deleteBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
