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
  showPopup = false; // Thêm thuộc tính này
  isEditMode = false; // Thêm thuộc tính này
  editedBlog: Blog = {
    id: 0,
    title: '',
    author: '',
    content: '',
    description: ''
  };
  newBlog: Blog = {
    id: 0,
    title: '',
    author: '',
    content: '',
    description: ''
  };
  selectedFile: File | null = null;
  
  editorConfig = { // Thêm thuộc tính này
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

deleteBlog(id: number): void {
  this.blogsService.deleteBlog(id).subscribe(() => this.loadBlogs());
}


  // Thêm phương thức openAddPopup
  openAddPopup(): void {
    this.isEditMode = false;
    this.newBlog = { id: 0, title: '', author: '', content: '', description: '' };
    this.showPopup = true;
  }

  // Thêm phương thức openEditPopup
  openEditPopup(blog: Blog): void {
    this.isEditMode = true;
    this.editedBlog = { ...blog };
    this.showPopup = true;
  }

  // Thêm phương thức onFileChange
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Thêm phương thức onSubmit
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.isEditMode) {
        this.blogsService.updateBlog(this.editedBlog.id, this.editedBlog).subscribe(() => {
          this.loadBlogs();
          this.showPopup = false;
        });
      } else {
        this.blogsService.addBlog(this.newBlog).subscribe(() => {
          this.loadBlogs();
          this.showPopup = false;
        });
      }
    }
  }

  // Thêm phương thức cancelPost
  cancelPost(): void {
    this.showPopup = false;
  }
}
