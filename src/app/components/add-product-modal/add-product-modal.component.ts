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
    animal_class_id: 0,
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
  { 
    id: 'FT', 
    name: 'Food & Treats', 
    children: [
      { id: 'DF', name: 'Dry Food' },
      { id: 'WF', name: 'Wet Food' },
      { id: 'TR', name: 'Treats' }
    ]
  },
  { 
    id: 'PC', 
    name: 'Pet Care', 
    children: [
      { id: 'DC', name: 'Dental Care' },
      { id: 'SV', name: 'Supplements & Vitamins' },
      { id: 'FT', name: 'Flea & Tick Control' },
      { id: 'SC', name: 'Shampoos & Conditioners' },
      { id: 'BC', name: 'Brushes & Combs' },
      { id: 'NC', name: 'Nail Care' },
      { id: 'DT', name: 'Deodorant Tools' }
    ]
  },
  { 
    id: 'TO', 
    name: 'Toys', 
    children: [
      { id: 'TY', name: 'Toys' },
      { id: 'TN', name: 'Training' }
    ]
  },
  { 
    id: 'AC', 
    name: 'Accessories', 
    children: [
      { id: 'CL', name: 'Collars & Leashes' },
      { id: 'AC', name: 'Apparel & Costume' },
      { id: 'FE', name: 'Feeders' }
    ]
  },
  { 
    id: 'FU', 
    name: 'Furniture', 
    children: [
      { id: 'BE', name: 'Bedding' },
      { id: 'CH', name: 'Crates, Houses & Pens' }
    ]
  },
  { 
    id: 'CK', 
    name: 'Carriers & Kennels', 
    children: [
      { id: 'CA', name: 'Carriers' },
      { id: 'KE', name: 'Kennels' }
    ]
  }
];


  animalClasses = [
    { value: 0, label: 'Cat' },
    { value: 1, label: 'Dog' },
    { value: 2, label: 'Both' }
  ];

  filteredChildCategories: { id: string; name: string }[] = [];

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

     // Đảm bảo `animal_class_id` là số nguyên khi gửi
  this.product.animal_class_id = parseInt(this.product.animal_class_id.toString(), 10);

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