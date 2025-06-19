import { Component, OnInit } from '@angular/core';
import { BlogsService } from '../../services/blogs.service'; // Điều chỉnh đường dẫn nếu cần
import { Blog } from '../../model/blogs.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  newBlog: Blog = { id: 0, title: '', content: '', description: '' };
  editMode = false;
  editedBlog: Blog = { id: 0, title: '', content: '', description: '' };
  showAddForm = false;



  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogsService.getBlogs().subscribe(blogs => this.blogs = blogs);
  }
  addBlog(): void {
    this.blogsService.addBlog(this.newBlog).subscribe(() => {
      this.loadBlogs();
      this.newBlog = { id: 0, title: '', content: '', description: '' };
    });
  }
  updateBlog(): void {
    this.blogsService.updateBlog(this.editedBlog.id, this.editedBlog).subscribe(() => {
      this.loadBlogs();
      this.editMode = false;
      this.editedBlog = { id: 0, title: '', content: '', description: '' };
    });
  }

  editBlog(blog: Blog): void {
    this.editMode = true;
    this.editedBlog = { ...blog };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editedBlog = { id: 0, title: '', content: '', description: '' };
  }

  deleteBlog(id: number): void {
    this.blogsService.deleteBlog(id).subscribe(() => this.loadBlogs());
  }
}
