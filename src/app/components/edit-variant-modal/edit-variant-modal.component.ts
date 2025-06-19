// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { NgIf } from '@angular/common';

// @Component({
//   selector: 'app-edit-variant-modal',
//   templateUrl: './edit-variant-modal.component.html',
//   styleUrls: ['./edit-variant-modal.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule, NgIf]
// })
// export class EditVariantModalComponent implements OnInit {
//   @Input() variantId?: string;
//   @Output() close = new EventEmitter<void>();

//   variant: any = {};

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.productService.getVariants('').subscribe(variants => {
//       this.variant = variants.find(v => v.variant_id === this.variantId) || {};
//     });
//   }

//   async submitForm(): Promise<void> {
//     if (!this.variantId) {
//       throw new Error('variantId is required');
//     }
//     await this.productService.updateVariant(this.variantId, {
//       variant_name: this.variant.variant_name,
//       price: this.variant.price,
//       quantity: this.variant.quantity,
//       discount: this.variant.discount || 0,
//       variant_image: this.variant.variant_image
//     });
//     this.close.emit();
//   }
// }

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-variant-modal',
  templateUrl: './edit-variant-modal.component.html',
  styleUrls: ['./edit-variant-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditVariantModalComponent implements OnInit {
  @Input() variantId: string = '';
  @Input() productId: string = '';
  @Output() close = new EventEmitter<void>();

  variant: any = {
    variant_id: '',
    variant_name: null,
    variant_price: null,
    variant_quantity: null,
    variant_discount: null,
    variant_image: null
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (this.variantId && this.productId) {
      this.loadVariant();
    }
  }

  loadVariant(): void {
    this.productService.getVariants(this.productId).subscribe(variants => {
      const variant = variants.find(v => v.variant_id === this.variantId);
      if (variant) {
        this.variant = {
          variant_id: variant.variant_id,
          variant_name: variant.variant_name,
          variant_price: variant.variant_price,
          variant_quantity: variant.variant_quantity,
          variant_discount: variant.variant_discount,
          variant_image: variant.variant_image
        };
      } else {
        alert('Không tìm thấy biến thể!');
        this.close.emit();
      }
    });
  }

  async submitForm(): Promise<void> {
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      { field: this.variant.variant_name, name: 'Tên biến thể' },
      { field: this.variant.variant_price, name: 'Giá' },
      { field: this.variant.variant_quantity, name: 'Số lượng' }
    ];

    const missingField = requiredFields.find(f => f.field === null || f.field === '');
    if (missingField) {
      alert(`Vui lòng nhập ${missingField.name}!`);
      return;
    }

    // Cập nhật dữ liệu biến thể
    const updatedVariantData = {
      variant_name: this.variant.variant_name,
      variant_price: this.variant.variant_price,
      variant_quantity: this.variant.variant_quantity,
      variant_discount: this.variant.variant_discount,
      variant_image: this.variant.variant_image || null
    };

    try {
      await this.productService.updateVariant(this.variantId, updatedVariantData);
      // Cập nhật sản phẩm nếu cần (giá, số lượng, giảm giá, hình ảnh)
      const variants = await this.productService.getVariants(this.productId).toPromise();
      const productUpdate: any = {
        quantity: Array.isArray(variants)
          ? variants.reduce((sum: number, v: any) => sum + (v.variant_quantity || 0), 0)
          : 0
      };
      if (Array.isArray(variants) && variants[0]?.variant_id === this.variantId) {
        productUpdate.price = this.variant.variant_price;
        productUpdate.discount = this.variant.variant_discount;
        productUpdate.product_image = this.variant.variant_image;
      }
      await this.productService.updateProduct(this.productId, productUpdate);
      this.close.emit();
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      alert('Lỗi khi cập nhật biến thể: ' + errorMessage);
    }
  }

  cancel(): void {
    this.close.emit();
  }
}