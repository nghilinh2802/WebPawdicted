// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-product-details-modal',
//   templateUrl: './product-details-modal.component.html',
//   styleUrls: ['./product-details-modal.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule]
// })
// export class ProductDetailsModalComponent implements OnInit {
//   @Input() productId?: string;
//   @Output() close = new EventEmitter<void>();

//   product: any = {};
//   variants: any[] = [];

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.productService.getProducts().subscribe((products: any[]) => {
//       this.product = products.find(p => p.product_id === this.productId) || {};
//     });
//     this.productService.getVariants(this.productId ?? '').subscribe((variants: any[]) => {
//       this.variants = variants;
//     });
//   }
// }

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe]
})
export class ProductDetailsModalComponent implements OnInit {
  @Input() productId: string = '';
  @Output() close = new EventEmitter<void>();

  product: any = {
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
    sold_quantity: null,
    variant_id: []
  };

  variants: any[] = [];

  categories = [
    { id: 'Food & Treats', name: 'Food & Treats', children: ['Dry Food', 'Wet Food', 'Treats'] },
    { id: 'Pet Care', name: 'Pet Care', children: ['Dental Care', 'Supplements & Vitamins', 'Flea & Tick Control', 'Shampoos & Conditioners', 'Brushes & Combs', 'Nail Care', 'Deodorant Tools'] },
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
      } else {
        alert('Không tìm thấy sản phẩm!');
        this.close.emit();
      }
    });
  }

  loadVariants(): void {
    this.productService.getVariants(this.productId).subscribe(variants => {
      this.variants = variants;
    });
  }

  getAnimalClassLabel(value: number): string {
    const animalClass = this.animalClasses.find(ac => ac.value === value);
    return animalClass ? animalClass.label : 'Không xác định';
  }

  getCategoryName(id: string): string {
    const category = this.categories.find(cat => cat.id === id);
    return category ? category.name : 'Không xác định';
  }

  closeModal(): void {
    this.close.emit();
  }
}