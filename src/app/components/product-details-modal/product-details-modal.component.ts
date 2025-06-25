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

  getSubCategoryName(id: string): string {
    for (let category of this.categories) {
      const subcategory = category.children.find(child => child.id === id);
      if (subcategory) return subcategory.name;
    }
    return 'Không xác định';
  }

  closeModal(): void {
    this.close.emit();
  }
}