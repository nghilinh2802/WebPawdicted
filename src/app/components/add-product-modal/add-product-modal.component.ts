// import { Component, EventEmitter, Output } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-add-product-modal',
//   templateUrl: './add-product-modal.component.html',
//   styleUrls: ['./add-product-modal.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule]
// })
// export class AddProductModalComponent {
//   @Output() close = new EventEmitter<void>();

//   product = {
//     product_id: '',
//     product_name: '',
//     description: '',
//     details: '',
//     animal_class_id: null,
//     category_id: '',
//     price: null,
//     quantity: null,
//     discount: null,
//     product_image: 'https://via.placeholder.com/60'
//   };

//   variants: any[] = [];

//   constructor(private productService: ProductService) {}

//   addVariant(): void {
//     this.variants.push({
//       variant_id: '',
//       variant_name: '',
//       price: null,
//       quantity: null,
//       discount: null,
//       variant_image: 'https://via.placeholder.com/60'
//     });
//     this.toggleProductFields();
//   }

//   removeVariant(index: number): void {
//     this.variants.splice(index, 1);
//     this.toggleProductFields();
//   }

//   toggleProductFields(): void {
//     const hasValidVariant = this.variants.some(v => v.variant_id && v.variant_name && v.price != null && v.quantity != null);
//     const fields = ['price', 'quantity', 'discount'];
//     fields.forEach(field => {
//       const input = document.getElementById(field) as HTMLInputElement;
//       input.disabled = hasValidVariant;
//       input.classList.toggle('disabled', input.disabled);
//     });
//   }

//   async submitForm(): Promise<void> {
//     if (!this.product.product_name || !this.product.animal_class_id || !this.product.category_id) {
//       alert('Vui lòng điền đầy đủ các trường bắt buộc!');
//       return;
//     }

//     if (this.variants.length > 0) {
//       const invalidVariant = this.variants.find(v => !v.variant_id || !v.variant_name || v.price == null || v.quantity == null);
//       if (invalidVariant) {
//         alert('Vui lòng điền đầy đủ thông tin cho tất cả biến thể!');
//         return;
//       }
//     } else if (!this.product.price || !this.product.quantity) {
//       alert('Vui lòng điền giá và số lượng nếu không có biến thể!');
//       return;
//     }

//     const productData = {
//       ...this.product,
//       variant_id: this.variants.map(v => v.variant_id),
//       price: this.variants.length > 0 ? this.variants[0].price : this.product.price,
//       quantity: this.variants.length > 0 ? this.variants.reduce((sum, v) => sum + (v.quantity || 0), 0) : this.product.quantity,
//       discount: this.variants.length > 0 ? null : this.product.discount
//     };

//     await this.productService.addProduct(productData);
//     for (const variant of this.variants) {
//       await this.productService.addVariant({
//         ...variant,
//         product_id: productData.product_id
//       });
//     }

//     this.close.emit();
//   }
// }

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
    child_category_id: '',
    price: null,
    quantity: null,
    discount: null,
    product_image: null,
    date_listed: null,
    also_buy: null,
    also_view: null,
    similar_item: null,
    average_rating: null,
    rating_number: null,
    rank: null,
    sold_quantity: null
  };

  variants: any[] = [];

  // Danh sách danh mục và danh mục con
  categories = [
  { id: 'Food & Treats', name: 'Food & Treats', children: ['Dry Food', 'Wet Food', 'Treats'] },
  { id: 'Pet Care', name: 'Pet Care', children: ['Dental Care', 'Supplements & Vitamins',  'Flea & Tick Control', 'Shampoos & Conditioners', 'Brushes & Combs', 'Nail Care', 'Deodorant Tools'] },
  { id: 'Toys', name: 'Toys', children: ['Toys', 'Training'] },
  { id: 'Accessories', name: 'Accessories', children: ['Collars & Leashes', 'Apparel & Costume', 'Feeders'] },
  { id: 'Furniture', name: 'Furniture', children: ['Bedding', 'Crates, Houses & Pens'] },
  { id: 'Carriers & Kennels', name: 'Carriers & Kennels', children: ['Carriers', 'Kennels'] }
  ];


  animalClasses = [
    { value: 0, label: 'Cat' },
    { value: 1, label: 'Dog' },
    { value: 2, label: 'Both' }
  ];

  filteredChildCategories: string[] = [];

  constructor(private productService: ProductService) {}

  // Cập nhật danh mục con khi chọn danh mục
  onCategoryChange(): void {
    const selectedCategory = this.categories.find(cat => cat.id === this.product.category_id);
    this.filteredChildCategories = selectedCategory ? selectedCategory.children : [];
    this.product.child_category_id = ''; // Reset danh mục con
    this.toggleProductFields();
  }

  addVariant(): void {
    this.variants.push({
      variant_id: '',
      variant_name: '',
      variant_price: null,
      variant_quantity: null,
      variant_discount: null,
      variant_image: null,
      variant_date_listed: null,
      variant_rating: null,
      variant_rating_number: null,
      variant_sold_quantity: null
    });
    this.toggleProductFields();
  }

  removeVariant(index: number): void {
    this.variants.splice(index, 1);
    this.toggleProductFields();
  }

  toggleProductFields(): void {
    const hasVariants = this.variants.length > 0;
    const fields = ['price', 'quantity', 'discount', 'product_image'];
    fields.forEach(field => {
      const input = document.getElementById(field) as HTMLInputElement;
      if (input) {
        input.disabled = hasVariants;
        input.classList.toggle('disabled', hasVariants);
      }
    });
  }

  async submitForm(): Promise<void> {
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      { field: this.product.product_id, name: 'Product ID' },
      { field: this.product.product_name, name: 'Product Name' },
      { field: this.product.description, name: 'Description' },
      { field: this.product.details, name: 'Details' },
      { field: this.product.animal_class_id, name: 'Animal Class' },
      { field: this.product.category_id, name: 'Category' },
      { field: this.product.child_category_id, name: 'Subcategory' }
    ];

    const missingField = requiredFields.find(f => f.field === null || f.field === '');
    if (missingField) {
      alert(`Vui lòng nhập ${missingField.name}!`);
      return;
    }

    // Kiểm tra biến thể
    if (this.variants.length > 0) {
      const invalidVariant = this.variants.find(
        v => !v.variant_id || !v.variant_name || v.variant_price == null || v.variant_quantity == null
      );
      if (invalidVariant) {
        alert('Vui lòng điền đầy đủ thông tin cho tất cả biến thể!');
        return;
      }
    } else if (!this.product.price || !this.product.quantity) {
      alert('Vui lòng điền giá và số lượng nếu không có biến thể!');
      return;
    }

    // Chuẩn bị dữ liệu sản phẩm
    const productData = {
      ...this.product,
      variant_id: this.variants.map(v => v.variant_id),
      price: this.variants.length > 0 ? this.variants[0].variant_price : this.product.price,
      quantity: this.variants.length > 0 ? this.variants.reduce((sum, v) => sum + (v.variant_quantity || 0), 0) : this.product.quantity,
      discount: this.variants.length > 0 ? this.variants[0].variant_discount : this.product.discount,
      product_image: this.variants.length > 0 ? this.variants[0].variant_image : this.product.product_image,
      date_listed: new Date(),
      also_buy: null,
      also_view: null,
      similar_item: null,
      average_rating: null,
      rating_number: null,
      rank: null,
      sold_quantity: null
    };

    // Lưu sản phẩm với product_id làm document ID
    await this.productService.addProduct(productData);
    for (const variant of this.variants) {
      await this.productService.addVariant({
        ...variant,
        product_id: productData.product_id,
        variant_date_listed: new Date(),
        variant_rating: null,
        variant_rating_number: null,
        variant_sold_quantity: null
      });
    }

    this.close.emit();
  }
}