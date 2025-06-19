import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-variant-modal',
  templateUrl: './edit-variant-modal.component.html',
  styleUrls: ['./edit-variant-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf]
})
export class EditVariantModalComponent implements OnInit {
  @Input() variantId?: string;
  @Output() close = new EventEmitter<void>();

  variant: any = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getVariants('').subscribe(variants => {
      this.variant = variants.find(v => v.variant_id === this.variantId) || {};
    });
  }

  async submitForm(): Promise<void> {
    if (!this.variantId) {
      throw new Error('variantId is required');
    }
    await this.productService.updateVariant(this.variantId, {
      variant_name: this.variant.variant_name,
      price: this.variant.price,
      quantity: this.variant.quantity,
      discount: this.variant.discount || 0,
      variant_image: this.variant.variant_image
    });
    this.close.emit();
  }
}