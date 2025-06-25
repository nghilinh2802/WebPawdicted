import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditProductModalComponent implements OnInit {
  @Input() productId: string = '';
  @Output() close = new EventEmitter<void>();

  product: any = {
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
    sold_quantity: null,
    variant_id: []
  };

  variants: any[] = [];
  editingVariantId: string | null = null;
  showAddVariantForm: boolean = false;
  newVariant: any = {
    variant_id: '',
    variant_name: '',
    variant_price: null,
    variant_quantity: null,
    variant_discount: null,
    variant_image: null,
    product_id: ''
  };
  isEditingProductImage: boolean = false;

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

  ngOnInit(): void {
    if (this.productId) {
      this.loadProduct();
      this.loadVariants();
    }
  }

  loadProduct(): void {
    this.productService.getProducts().subscribe(products => {
      const product = products.find(p => p.product_id === this.productId);
      if (product) {
        this.product = { ...product };
        this.onCategoryChange(); // Cập nhật danh mục con
      } else {
        alert('Không tìm thấy sản phẩm!');
        this.close.emit();
      }
    });
  }

  loadVariants(): void {
    this.productService.getVariants(this.productId).subscribe(variants => {
      this.variants = variants;
      this.toggleProductFields();
    });
  }

  // onCategoryChange(): void {
  //   const selectedCategory = this.categories.find(cat => cat.id === this.product.category_id);
  //   this.filteredChildCategories = selectedCategory ? selectedCategory.children : [];
  //   if (!this.filteredChildCategories.includes(this.product.child_category_id)) {
  //     this.product.child_category_id = '';
  //   }
  //   this.toggleProductFields();
  // }

onCategoryChange(): void {
  const selectedCategory = this.categories.find(cat => cat.id === this.product.category_id);
  this.filteredChildCategories = selectedCategory ? selectedCategory.children : [];
  if (this.filteredChildCategories.some(child => child.id === this.product.child_category_id)) {
    return; // Giữ lại giá trị child_category_id hiện tại
  }
  this.product.child_category_id = ''; // Reset nếu không tìm thấy
  this.toggleProductFields();
}



  toggleProductFields(): void {
    const hasVariants = this.variants.length > 0;
    const fields = ['price', 'quantity', 'discount'];
    fields.forEach(field => {
      const input = document.getElementById(field) as HTMLInputElement;
      if (input) {
        input.disabled = hasVariants;
        input.classList.toggle('disabled', hasVariants);
      }
    });
  }

  editVariant(variantId: string): void {
    this.editingVariantId = variantId;
  }

  cancelEdit(): void {
    this.editingVariantId = null;
    this.loadVariants(); // Tải lại variants để khôi phục trạng thái ban đầu
  }

  addVariant(): void {
    this.showAddVariantForm = true;
    this.newVariant = {
      variant_id: '',
      variant_name: '',
      variant_price: null,
      variant_quantity: null,
      variant_discount: null,
      variant_image: null,
      product_id: this.productId
    };
  }

  cancelAddVariant(): void {
    this.showAddVariantForm = false;
    this.newVariant = {
      variant_id: '',
      variant_name: '',
      variant_price: null,
      variant_quantity: null,
      variant_discount: null,
      variant_image: null,
      product_id: ''
    };
  }

  async saveNewVariant(): Promise<void> {
    if (!this.newVariant.variant_id || !this.newVariant.variant_name || this.newVariant.variant_price == null || this.newVariant.variant_quantity == null || !this.newVariant.variant_image) {
      alert('Vui lòng điền đầy đủ ID, tên, giá, số lượng và hình ảnh!');
      return;
    }
    try {
      await this.productService.addVariant(this.newVariant);
      this.loadVariants(); // Làm mới danh sách biến thể
      this.showAddVariantForm = false;
      this.newVariant = {
        variant_id: '',
        variant_name: '',
        variant_price: null,
        variant_quantity: null,
        variant_discount: null,
        variant_image: null,
        product_id: ''
      };
    } catch (error) {
      alert('Lỗi khi thêm biến thể: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  async deleteVariant(variantId: string): Promise<void> {
    if (confirm('Bạn có chắc muốn xóa biến thể này?')) {
      try {
        await this.productService.deleteVariant(variantId);
        this.loadVariants(); // Làm mới danh sách biến thể
        this.editingVariantId = null;
      } catch (error) {
        alert('Lỗi khi xóa biến thể: ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  }

  toggleEditProductImage(): void {
    this.isEditingProductImage = !this.isEditingProductImage;
  }

  async submitForm(): Promise<void> {
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
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

    if (this.variants.length === 0 && (!this.product.price || !this.product.quantity || !this.product.product_image)) {
      alert('Vui lòng điền giá, số lượng và hình ảnh nếu không có biến thể!');
      return;
    }

    // Chuẩn bị dữ liệu cập nhật sản phẩm
    const updatedProductData = {
      product_name: this.product.product_name,
      description: this.product.description,
      details: this.product.details,
      animal_class_id: this.product.animal_class_id,
      category_id: this.product.category_id,
      child_category_id: this.product.child_category_id,
      price: this.variants.length > 0 ? this.variants[0]?.variant_price : this.product.price,
      quantity: this.variants.length > 0 ? this.variants.reduce((sum: number, v: any) => sum + (v.variant_quantity || 0), 0) : this.product.quantity,
      discount: this.variants.length > 0 ? this.variants[0]?.variant_discount : this.product.discount,
      product_image: this.product.product_image, // Cho phép thay đổi
      variant_id: this.variants.map(v => v.variant_id)
    };

    try {
      // Cập nhật sản phẩm
      await this.productService.updateProduct(this.productId, updatedProductData);

      // Cập nhật các biến thể đã chỉnh sửa
      for (const variant of this.variants) {
        if (this.editingVariantId === variant.variant_id || this.variants.some(v => v.variant_id === variant.variant_id && (v.variant_name || v.variant_price || v.variant_quantity || v.variant_discount || v.variant_image))) {
          const updatedVariantData = {
            variant_name: variant.variant_name,
            variant_price: variant.variant_price,
            variant_quantity: variant.variant_quantity,
            variant_discount: variant.variant_discount || null,
            variant_image: variant.variant_image || null,
            product_id: this.productId
          };
          await this.productService.updateVariant(variant.variant_id, updatedVariantData);
        }
      }

      this.close.emit();
      this.isEditingProductImage = false; // Reset sau khi lưu
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      alert('Lỗi khi cập nhật sản phẩm hoặc biến thể: ' + errorMessage);
    }
  }

  cancel(): void {
    this.close.emit();
    this.isEditingProductImage = false; // Reset khi hủy
  }
}