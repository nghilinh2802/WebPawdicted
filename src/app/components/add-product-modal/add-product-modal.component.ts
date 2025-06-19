import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddProductModalComponent {
  @Output() close = new EventEmitter<void>();

  product = {
    product_id: '',
    product_name: '',
    description: '',
    details: '',
    animal_class_id: null,
    category_id: '',
    price: null,
    quantity: null,
    discount: null,
    product_image: 'https://via.placeholder.com/60'
  };

  variants: any[] = [];

  constructor(private productService: ProductService) {}

  addVariant(): void {
    this.variants.push({
      variant_id: '',
      variant_name: '',
      price: null,
      quantity: null,
      discount: null,
      variant_image: 'https://via.placeholder.com/60'
    });
    this.toggleProductFields();
  }

  removeVariant(index: number): void {
    this.variants.splice(index, 1);
    this.toggleProductFields();
  }

  toggleProductFields(): void {
    const hasValidVariant = this.variants.some(v => v.variant_id && v.variant_name && v.price != null && v.quantity != null);
    const fields = ['price', 'quantity', 'discount'];
    fields.forEach(field => {
      const input = document.getElementById(field) as HTMLInputElement;
      input.disabled = hasValidVariant;
      input.classList.toggle('disabled', input.disabled);
    });
  }

  async submitForm(): Promise<void> {
    if (!this.product.product_name || !this.product.animal_class_id || !this.product.category_id) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    if (this.variants.length > 0) {
      const invalidVariant = this.variants.find(v => !v.variant_id || !v.variant_name || v.price == null || v.quantity == null);
      if (invalidVariant) {
        alert('Vui lòng điền đầy đủ thông tin cho tất cả biến thể!');
        return;
      }
    } else if (!this.product.price || !this.product.quantity) {
      alert('Vui lòng điền giá và số lượng nếu không có biến thể!');
      return;
    }

    const productData = {
      ...this.product,
      variant_id: this.variants.map(v => v.variant_id),
      price: this.variants.length > 0 ? this.variants[0].price : this.product.price,
      quantity: this.variants.length > 0 ? this.variants.reduce((sum, v) => sum + (v.quantity || 0), 0) : this.product.quantity,
      discount: this.variants.length > 0 ? null : this.product.discount
    };

    await this.productService.addProduct(productData);
    for (const variant of this.variants) {
      await this.productService.addVariant({
        ...variant,
        product_id: productData.product_id
      });
    }

    this.close.emit();
  }
}