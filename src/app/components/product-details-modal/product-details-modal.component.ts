import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductDetailsModalComponent implements OnInit {
  @Input() productId?: string;
  @Output() close = new EventEmitter<void>();

  product: any = {};
  variants: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: any[]) => {
      this.product = products.find(p => p.product_id === this.productId) || {};
    });
    this.productService.getVariants(this.productId ?? '').subscribe((variants: any[]) => {
      this.variants = variants;
    });
  }
}