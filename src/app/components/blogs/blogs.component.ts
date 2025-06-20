import { Component, OnInit } from '@angular/core';
import { Blog } from '../../model/blogs.model';
import { BlogsService } from '../../services/blogs.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  showPopup = false;
  isEditMode = false;
  editedBlog: Blog = {
    id: '', // Đổi từ number sang string
    title: '',
    author: '',
    content: '',
    description: '',
    imageURL: '',
  };
  newBlog: Blog = {
    id: '', // Đổi từ number sang string
    title: '',
    author: '',
    content: '',
    description: '',
    imageURL: '',
    createdAt: undefined,
    updatedAt: undefined 
  };
  selectedFile: File | null = null;
  
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  };

  constructor(private blogsService: BlogsService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogsService.getBlogs().subscribe(blogs => this.blogs = blogs);
  }

  async deleteBlog(id: string): Promise<void> { // Đổi kiểu id sang string
    try {
      await this.blogsService.deleteBlog(id);
      this.loadBlogs(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  openAddPopup(): void {
    this.isEditMode = false;
    this.newBlog = { 
      id: '', 
      title: '', 
      author: '', 
      content: '', 
      description: '' ,
      imageURL: '',
      createdAt: undefined,
      updatedAt: undefined
    };
    this.showPopup = true;
  }

  openEditPopup(blog: Blog): void {
    this.isEditMode = true;
    this.editedBlog = { ...blog };
    this.showPopup = true;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit(form: NgForm): Promise<void> { // Chuyển sang async/await
    if (form.valid) {
      try {
        if (this.isEditMode) {
          await this.blogsService.updateBlog(this.editedBlog.id, this.editedBlog);
        } else {
          await this.blogsService.addBlog(this.newBlog);
        }
        this.loadBlogs(); // Tải lại danh sách sau khi thêm/cập nhật
        this.showPopup = false;
      } catch (error) {
        console.error('Error saving blog:', error);
      }
    }
  }

  cancelPost(): void {
    this.showPopup = false;
  }
}