import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      product_id: 'FT0001',
      product_name: 'Pedigree Chicken and Vegetables Adult Dog Dry Food',
      variant_id: ['FT00011', 'FT00012'],
      variant_name: ['20kg', '15kg'],
      price: 300000,
      description: 'Pedigree Chicken and Vegetables Adult Dog Dry Food is crafted to provide your adult dog a balanced and nutritious diet...',
      details: 'Food type: Dry food\nSize/Weight: 20kg/15kg/10kg\nIngredients: Chicken, vegetables\nHealth Benefits: Supports immune system\nStorage: Cool, dry place\nManufacturing Location: Thailand\nBrand: Pedigree\nCertifications: Certificate of Authenticity',
      average_rating: 3.5,
      rating_number: 167,
      quantity: 50,
      product_image: 'https://via.placeholder.com/60',
      animal_class_id: 1,
      category_id: 'FO',
      child_category_id: 'FT',
      variant_quantity: [30, 20],
      variant_price: [300000, 300000],
      variant_image: ['https://via.placeholder.com/60', 'https://via.placeholder.com/60'],
      variants_number: 2,
      created_date: new Date('2025-06-17'),
      discount: 5,
      stock: 998
    },
    {
      product_id: 'FT0009',
      product_name: 'CIAO Tuna & Scallop',
      variant_id: [],
      variant_name: [],
      price: 20000,
      description: 'CIAO Tuna & Scallop Flavoured Packets...',
      details: 'Weight: 60gr\nOrigin: Japan',
      average_rating: 4.8,
      rating_number: 55,
      quantity: 61,
      product_image: 'https://via.placeholder.com/60',
      animal_class_id: 0,
      category_id: 'FO',
      child_category_id: 'FT',
      variant_quantity: [],
      variant_price: [],
      variant_image: [],
      variants_number: 0,
      created_date: new Date('2024-11-01'),
      discount: 10,
      stock: 1000
    },
    {
      product_id: 'FT0015',
      product_name: 'Chicken Jerky',
      variant_id: [],
      variant_name: [],
      price: 15000,
      description: 'Chicken Jerky Treats...',
      details: 'Weight: 50gr\nOrigin: USA',
      average_rating: 4.6,
      rating_number: 70,
      quantity: 80,
      product_image: 'https://via.placeholder.com/60',
      animal_class_id: 0,
      category_id: 'TR',
      child_category_id: 'FT',
      variant_quantity: [],
      variant_price: [],
      variant_image: [],
      variants_number: 0,
      created_date: new Date('2024-11-07'),
      discount: 25,
      stock: 1200
    },
    {
      product_id: 'PC0009',
      product_name: 'BIOLINE Ear Care Ear Drops',
      variant_id: [],
      variant_name: [],
      price: 150000,
      description: 'BIOLINE Ear Care ear drops...',
      details: 'Volumetric: 50ml',
      average_rating: 4.7,
      rating_number: 198,
      quantity: 22,
      product_image: 'https://via.placeholder.com/60',
      animal_class_id: 2,
      category_id: 'HE',
      child_category_id: 'PC',
      variant_quantity: [],
      variant_price: [],
      variant_image: [],
      variants_number: 0,
      created_date: new Date('2024-11-03'),
      discount: 5,
      stock: 95
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  addProduct(product: Product): Observable<Product> {
    this.products.push(product);
    return of(product);
  }

  updateProduct(product: Product): Observable<Product> {
    const index = this.products.findIndex(p => p.product_id === product.product_id);
    if (index !== -1) {
      this.products[index] = product;
    }
    return of(product);
  }

  deleteProduct(productId: string): Observable<void> {
    this.products = this.products.filter(p => p.product_id !== productId);
    return of(void 0);
  }

  deleteVariant(productId: string, variantId: string): Observable<void> {
    const product = this.products.find(p => p.product_id === productId);
    if (product) {
      const index = product.variant_id.indexOf(variantId);
      if (index !== -1) {
        product.variant_id.splice(index, 1);
        product.variant_name.splice(index, 1);
        product.variant_quantity.splice(index, 1);
        product.variant_price.splice(index, 1);
        product.variant_image.splice(index, 1);
        product.variants_number = product.variant_id.length;
      }
    }
    return of(void 0);
  }
}