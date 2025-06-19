import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf]
})
export class EditProductModalComponent implements OnInit {
  @Input() productId!: string;
  @Output() close = new EventEmitter<void>();

  product: any = {};
  hasVariants: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.product = products.find(p => p.product_id === this.productId) || {};
      this.hasVariants = this.product.variant_id?.length > 0;
      this.toggleProductFields();
    });
  }

  toggleProductFields(): void {
    const fields = ['price', 'quantity', 'discount'];
    fields.forEach(field => {
      const input = document.getElementById(`edit-${field}`) as HTMLInputElement;
      input.disabled = this.hasVariants;
      input.classList.toggle('disabled', input.disabled);
    });
  }

  async submitForm(): Promise<void> {
    await this.productService.updateProduct(this.productId, {
      product_name: this.product.product_name,
      description: this.product.description,
      details: this.product.details,
      animal_class_id: this.product.animal_class_id,
      category_id: this.product.category_id,
      price: this.hasVariants ? null : this.product.price,
      quantity: this.hasVariants ? null : this.product.quantity,
      discount: this.hasVariants ? null : this.product.discount
    });
    this.close.emit();
  }
}